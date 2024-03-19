import './scss/styles.scss';
import { LarekAPI } from './components/larekAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { AppState, CatalogChangeEvent } from './components/appData';
import { Card, BasketItem } from './components/card';
import { FormPayment, FormContacts } from './components/order';
import { Page } from './components/page';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Basket } from './components/common/basket';
import { Modal } from './components/common/modal';
import { Success } from './components/common/success';
import { IOrderInputs, ICard, IFormContacts, IFormPayment } from './types';

const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const formPayment = new FormPayment(cloneTemplate(orderTemplate), events);
const formContacts = new FormContacts(cloneTemplate(contactsTemplate), events);

// Дальше идет бизнес-логика. Поймали событие, сделали что нужно
// Изменяет элементы каталога
events.on<CatalogChangeEvent>('cards:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});

		return card.render({
			id: item.id,
			image: item.image,
			title: item.title,
			category: item.category,
			price: item.price,
		});
	});
});

// Открывает выбранную карточку товара
events.on('card:select', (item: ICard) => {
	appData.setPreview(item);
});

// Открывает превью карточки товара
events.on('preview:changed', (item: ICard) => {
	const card = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			events.emit('card:add', item);
			events.emit('preview:changed', item);
		},
	});
	modal.render({
		content: card.render({
			description: item.description,
			image: item.image,
			title: item.title,
			category: item.category,
			price: item.price,
			button: appData.setButtonText(item),
		}),
	});
});

// Изменились товары в корзине
events.on('basket:changed', () => {
	page.counter = appData.getBasket().length;
	basket.items = appData.getBasket().map((item, index) => {
		const basketItem = new BasketItem(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				events.emit('card:delete', item);
			},
		});

		basketItem.setIndex(index);

		return basketItem.render({
			title: item.title,
			price: item.price,
		});
	});
	basket.total = appData.getTotal();
});

// Добавляет товар в корзину
events.on('card:add', (item: ICard) => {
	appData.toggleOrderedItem(item);
});

// Удаляет товар из корзины
events.on('card:delete', (item: ICard) => {
	appData.deleteItem(item);
});

// Открывает корзину
events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});

// Открывает форму №1 для заполнения метода оплаты и адреса
events.on('order:open', () => {
	modal.render({
		content: formPayment.render({
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

// Переключает вид оплаты товара
events.on(
	'payment:change',
	(data: { payment: string; button: HTMLElement }) => {
		formPayment.togglePayment(data.button);
		appData.setPayment(data.payment);
		appData.validateOrder();
	}
);

// Открывает форму №2 для заполнения контактных данных
events.on('order:submit', () => {
	modal.render({
		content: formContacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

// Изменилось одно из полей формы №1 (метод оплаты и адрес)
events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderInputs; value: string }) => {
		appData.setInput(data.field, data.value);
	}
);

// Изменилось состояние валидации формы №1 (метод оплаты и адрес)
events.on('formErrors:change', (errors: Partial<IFormPayment>) => {
	const { address, payment } = errors;
	formPayment.valid = !payment && !address;
	formPayment.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
});

// Изменилось одно из полей формы №2 (контакты: телефон и почта)
events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IOrderInputs; value: string }) => {
		appData.setInput(data.field, data.value);
	}
);

// Изменилось состояние валидации формы №2 (контакты: телефон и почта)
events.on('formErrors:change', (errors: Partial<IFormContacts>) => {
	const { phone, email } = errors;
	formContacts.valid = !phone && !email;
	formContacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

// Отправляет форму заказа и обрабатывает клик "За новыми покупками"
events.on('contacts:submit', () => {
	appData.sendOrder();
	api
		.postOrder(appData.order)
		.then((result) => {
			const totalDescription = result.total.toString();
			const success = new Success(
				cloneTemplate(successTemplate),
				totalDescription,
				{
					onClick: () => {
						modal.close();
					},
				}
			);
			modal.render({
				content: success.render({
					total: result.total,
				}),
			});
			appData.clearBasket();
		})
		.catch((err) => {
			console.error(err);
		});
});

// Блокирует прокрутку страницы, если открыто модальное окно
events.on('modal:open', () => {
	page.locked = true;
});

// Разблокирует прокрутку страницы, если открыто модальное окно
events.on('modal:close', () => {
	page.locked = false;
});

// Получает товары с сервера
api
	.getCardList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});
