import { Model } from './base/model';
import { FormErrors, IAppState, ICard, IOrderData, IOrderInputs, IBasketItem, PaymentMethod, IFormContacts } from '../types';

export type CatalogChangeEvent = {
	catalog: ICard[];
};

export class Card extends Model<ICard> {
	id: string;
    description?: string;
    image?: string;
    title: string;
    category: string;
    price: number | null;
}

export class AppState extends Model<IAppState> {
	catalog: ICard[] = [];
	basket: ICard[] = [];
	order: IOrderData = {
        payment: '',
        email: '',
	    phone: '',
	    address: '',
		total: 0,
		items: [],
		valid: false,
        errors: [],
	};
	preview: string | null;
	formErrors: FormErrors = {};

	//Добавляет товары в каталог
	setCatalog(items: ICard[]) {
		items.map((item) => (this.catalog = [...this.catalog, item]));
		this.emitChanges('cards:changed', { catalog: this.catalog });
    }

	setPreview(item: ICard) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

    //Определяет текст кнопки для товара в зависимости от того, 
	// находится ли он уже в корзине или нет
	setButtonText(item: ICard) {
		if (this.order.items.some((id) => id === item.id)) {
			return 'Убрать';
		} else return 'В корзину';
	}
    
	//Возвращает массив товаров, находящихся в корзине
	getBasket(): ICard[] {
		const array: ICard[] = [];
		this.order.items.forEach((id) => {
			array.push(this.catalog.find((item) => item.id === id));
		});
		return array;
	}
   	
	//Добавляет товар в корзину, если его там нет, 
	//или вызывает метод удаления из корзины, если уже присутствует.
	toggleOrderedItem(item: ICard) {
		if (!this.order.items.some((id) => id === item.id)) {
			this.order.items = [...this.order.items, item.id];
			this.emitChanges('basket:changed');
		} else {
			this.deleteItem(item);
		}
	}

    //Удаляет товар из корзины
	deleteItem(item: ICard) {
		if (this.order.items.some((id) => id === item.id)) {
			this.order.items = this.order.items.filter((id) => item.id !== id);
			this.emitChanges('basket:changed');
		}
		return;
	}

    //Очищает корзину 
	clearBasket() {
		this.order = {
			payment: '',
            email: '',
	        phone: '',
	        address: '',
	    	total: 0,
		    items: [],
		    valid: false,
            errors: [],
		};
		this.basket = [];
		this.emitChanges('basket:changed');
	}

	//Формирует заказ из корзины для отправки и вызывает  метод подсчета общей суммы
	sendOrder() {
		this.basket.forEach(
			(item) => (this.order.items = [...this.order.items, item.id])
		);
		this.order.total = this.getTotal();
	}

	//Вычисляет общую сумму заказа корзины
	getTotal() {
		return this.order.items.reduce(
			(a, c) => a + this.catalog.find((it) => it.id === c).price,
			0
		);
	}

	//Устанавливает способ оплаты 
    setPayment(value: string) {
		if (this.order.payment !== value) this.order.payment = value;
	}

	setInput(
		field: keyof IOrderInputs,
		value: string
	) {
		this.order[field] = value;
		this.validateOrder();
		// if (this.validateOrder()) {
		// 	this.events.emit('order:ready', this.order)
		// }
	}

	//Проверяет правильность заполнения полей ввода
	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}

		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}

		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес доставки';
		}

		if (!this.order.payment) {
			errors.payment = 'Необходимо указать способ оплаты';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
};