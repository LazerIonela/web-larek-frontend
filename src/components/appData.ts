//данный раздел еще в разработке
import { Model } from './base/Model';
import { FormErrors, IAppState, ICard, IOrderData, IBasketItem, PaymentMethod } from '../types';

export type CatalogChangeEvent = {
	catalog: ICard[];
};

export class AppState extends Model<IAppState> {
	catalog: ICard[] = [];
	basket: IBasketItem[] = [];
	order: IOrderData = {
        payment: '',
        email: '',
	    phone: '',
	    address: '',
		total: 0,
		items: [],
	};
	preview: string | null;
	formErrors: FormErrors = {};

	setPayment(value: string) {
		if (this.order.payment !== value) this.order.payment = value;
	}

	setAddress(value: string) {
		this.order.address = value;
	}

	setCatalog(items: ICard[]) {
		items.map((item) => (this.catalog = [...this.catalog, item]));
		this.emitChanges('cards:changed', { catalog: this.catalog });
	}

	setPreview(item: ICard) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	getBasket(): IBasketItem[] {
		return this.basket;
	}

	toggleItem(item: ICard) {
		if (!this.basket.some((card) => card.id === item.id)) {
			this.basket = [...this.basket, item];
			this.emitChanges('basket:changed');
		} else {
			this.toggleItem(item);
		}
	}

	getTotal() {
		let total = 0;
		this.basket.forEach((card) => (total += card.price));
		return total;
	}

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
}