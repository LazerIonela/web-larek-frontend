# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
Архитектура проекта: 
MVP (Model-View-Presenter)

# КЛЮЧЕВЫЕ ТИПЫ ДАННЫХ
## Интерфейсы: 

**ICard** - вся информация о товаре, хранящаяся в карточке
```
interface ICard {
    id: string;
    description?: string;
    image?: string;
    title: string;
    category: string;
    price: number | null;
    button?: string;
}
```
**IBasketItem** - информация о товаре, находящимся в корзине
```
interface IBasketItem {
    index: number;
	deleteButton: boolean;
}
```
**IForm** - описывает интерфейс модальных окон
```
interface IForm {
    valid: boolean;
    errors: string[];
}
```
**IFormPayment** - описывает интерфейс модального окна, где пользователь указывает метод оплаты и адрес доставки
```
interface IFormPayment extends IForm {
    payment: PaymentMethod;
	address: string;
}
```
**IFormContacts** - описывает интерфес модального окна, где пользователь указывает свои контакты: телефон и электронную почту
```
interface IFormContacts extends IForm {
    email: string;
    phone: string;
}
```
**IOrderSuccess** - описывает интерфейс модального окна, с информацией об удачной покупке и ее общей стоимости.
```
interface IOrderSuccess {
    id: string;
    total: number;
}
```

**IOrderData** - интерфейс данных клиента  по заказу
```
interface IOrderData extends IFormPayment, IFormContacts{
	total: number;
	items: string[];
}
```
**IEvents** - описывает функционал для работы с событиями (events) и включает методы (по порядку соответственно):
1) Метод для подписки на событие. Принимает имя события (event) и опциональные данные (data), которые будут переданы подписчикам этого события.
2) Метод для генерации события. Принимает имя события (event) и опциональные данные (data), которые будут переданы подписчикам этого события.
3) Метод для создания функции-обработчика события. Принимает имя события (event) и контекст (context), и возвращает функцию, которая будет вызвана при возникновении события.
```
interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void; 
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}
```

**IModalData** - описывает интерфейс HTML элемента
```
interface IModalData {
	content: HTMLElement;
}
```

**ISuccessActions** - описывает интерфейс для обработки событий 
```
interface ISuccessActions {
	onClick: () => void;
}
```

**ICardList** - описывает интерфейс списка карточек
```
interface ICardList {
	total: number;
	items: ICard[];
}
```

**ICardActions** - описывает интерфейс для обработки событий 
```
interface ICardActions {
	onClick: (event: MouseEvent) => void;
}
```

**IOrderInputs** - описывает интерфейс полей ввода данных клиентом
```
interface IOrderInputs {
	address: string;
	email: string;
	phone: string;
}
```
**IPage** - интерфейс структуры данных страницы
```
interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}
```

## Базовый код:
**class Api** - базовый класс по подключению проекта. Имеет два поля baseUrl и options, которые инициализуются с помощью конструктора.
Включает методы:
- `handleResponse` -  возвращает ответ сервера в формате JSON. При возникновении ошибки - обрабатывает ее. Данный метод вызывается из всех остальных методов;
- `get` - принимает путь, возвращает информацию от сервера
- `post` - принимает путь и данные для отправки на сервер, возвращает информацию от сервера;

**class EventEmitter** - базовый класс по работе с событиями (брокер событий) на базе интерфейса IEvents. Имеет дополнительное поле events.
Включает методы:
- `on`- установить обработчик на событие. Если события не существует, то создает его
- `off` - удалить обработчик с события. Если обработчиков не существует, то удаляет событие
- `emit` - инициировать событие с данными;
- `onAll` - слушать все события;
- `offAll` - удалить все события;
- `trigger` - сделать коллбек триггер, генерирующий событие при вызове

**class Component<T>** - абстрактный класс, который является базовым классом для создания UI компонентов. Он содержит методы, которые взаимодействуют с DOM элементами. 

Конструктор класса: принимает HTMLElement и инициализирует его.
Включает методы:
- `toggleClass` - переключает класс;
- `setText` - устаналивает текстовое содержимое;
- `setDisabled` - меняет статус блокировки;
- `setHidden` - скрывает элемент;
- `setVisible` - делает видимым элемент;
- `setImage` - устаналивает изображение с альтернативным текстом;
- `render` - рендерит компонент

**class Model<T>**- абстрактный класс, описывающий базовую модель, чтобы можно было ее отличить от простых объектов с данными. Конструктор базовой модели принимает данные и объект уведомлений об изменениях
Включает методы:
- `emitChanges` - можно модифицировать состав данных перед отправкой

# Слой VIEW  
Отвечает за отображение UI и взаимодействия с ним.
**class Modal extends Component** - основа для модальных окон. Конструктор принимает container и events. В контейнере ищет кнопку закрытия модального окна и контент.
Включает методы:
- `set content` - установка или обновление контента
- `open` - открытие модального окна
- `close` - закрытие модального окна
- `render` - отображение модального окна с данными

**class Basket extends Component** - для отображения корзины с товарами  
Включает методы:  
- `set items` - список товаров в корзине
- `set selected` - исключение товаров, не имеющих стоимость
- `set total` - общая сумма товаров в корзине

**class Card extends Component** - основа для карточек в каталоге.  Принимает контейнер (HTMLElement). Поля класса включает поля интерфейcа ICard.  
Включает методы:   
- `setTitle` - устанавливает название карточки
- `setImage` - устаналивает изображение карточки
- `setCategory` - устаналивает категорию карточки
- `setPrice` - устаналивает стоимость товара карточка
- `setDescription` - устанавливает описание карточки

**class CardView extends Card** - для отображения карточек в каталоге  
**class CardPreview extends Card** - для отображения карточек в модальном окне  
**class Form extends Component** - основа для форм заказа товаров  
**class FormPayment extends Form** - отображение формы с выбором способа оплаты и адреса доставки  
**class FormContacts class Form** - отображение формы с указанием  электронной почты и телефона  
**class OrderSuccess class Form** - отображение формы с успешным заказом  


# Слой MODEL  
Представлен классом **AppState**, который реализуется интерфейсом IAppState. 
```
interface IAppState {
    catalog: ICard[];
    basket: IBasketItem[];
    order: IOrderData | null;
    preview: string | null;
}
```
Включает методы: 
- `setPayment` - устаналивает метод оплаты
- `setAddress` - устаналивает адрес доставки
- `setCatalog` - возвращает массив карточек каталога
- `setPreview`- устаналивает в параметре превью id выбранной карточки
- `setButtonText`- меняет текст кнопки для товара в зависимости от того, находится ли он уже в корзине или нет
- `getBasket` - возвращает массив карточек, добавленных в корзину
- `toggleOrderedItem` - добавляет товар в корзину или удаляет его в случае если он уже был добавлен
- `deleteItem` - удаляет товар из корзины
- `clearBasket` - очищает корзину 
- `sendOrder` - формирует заказ из корзины для отправки и вызывает  метод подсчета общей суммы
- `getTotal` - возращает общую сумму товаров в корзине;
- `setInput` - устаналивает способ оплаты;
- `validateOrder` - оповещает о некорректно заполненных или не  заполненных полях

# Слой Сервисный  
**class LarekAPI** - реализация интерфейса ILarekAPI для работы с API, расширяет класс Api на базе интерфейса ILarekAPI
```
interface ILarekAPI {
	getCardList: () => Promise<ICard[]>;
	getCard: (id: string) => Promise<ICard>;
	postOrder: (order: IOrderData) => Promise<IOrderSuccess>;
}
```
Класс принимает на входе помимо указанных в базовом классе параметров, параметр cdn для путей изображений. baseUrl и options уходят в super();
Включает методы:
- `getCardList` - получает массив карточек с сервера
- `getCard` - получает конкретную карточку с сервера
- `postOrder` - отправляет заказ на сервер

# Слой PRESENTER   
Описывает взаимодействие отображения и данных между собой. Взаимодействие осуществляется за счет организации подписки на события в брокере событий (экземпляр класса EventEmitter) и отслеживания этих событий. Размещается в корневом файле index.ts

**Описание основных событий** 
`cards:chaged` - обновляет элементы каталога  
`card:select` - при нажатии на карточку товара отправляет данные выбранной карточки в модель, открывает модальное окно с карточкой   
`preview:changed` - обновляет превью карточки товара  
`basket:open` - открывает корзины  
`basket:changed` - обновляет содержимое корзины  
`card:add` - при нажатии на кнопку "в корзину" добавляет элемент в корзину  
`card:delete` - при нажатии на кнопку "Убрать из корзины" удаляет элемент из корзины   
`order:open` - при нажатии кнопки "Оформить" в корзине открывается форма оформления заказа b нажатии кнопки "Далее"   
`order:submit` - при заполнении второй части формы и нажатии кнопки "Оплатить"    
`payment:change` - переключает вид оплаты, в зависимости от нажатой кнопки  
`/^order\..*:change/`- изменение любых input элементов формы  
`/^contacts\..*:change/`- изменение любых input элементов второй части формы  
 `contacts:submit` - информация из формы успешно ушла на сервер о открывается окно об успешном заказе   
 `formErrors:change` - при обнаружении событий при валидации отображаются ошибки  
 `modal:open` - при открытии модального окна, блокируется страница  
 `modal:closed` - при закрытии модального окна, блокировка страницы снимается  
