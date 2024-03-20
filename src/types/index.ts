export interface IModalData {
	content: HTMLElement;
}

export interface IOrderSuccess {
	id: string;
	total: number;
}

export interface ISuccessActions {
	onClick: () => void;
}

export interface ICard {
	id: string;
	description?: string;
	image?: string;
	title: string;
	category: string;
	price: number | null;
	button?: string;
}

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface IBasketItem {
	index: number;
	deleteButton: boolean;
}

export interface IBasketView {
	items: HTMLElement[];
	total: number;
	selected: string[];
}

export interface IForm {
	valid: boolean;
	errors: string[];
}

export interface IFormPayment extends IForm {
	payment: string;
	address: string;
}

export interface IFormContacts extends IForm {
	email: string;
	phone: string;
}
export interface IOrderData extends IFormPayment, IFormContacts {
	total: number;
	items: string[];
}

export interface IOrderInputs {
	address: string;
	email: string;
	phone: string;
}

export type FormErrors = Partial<Record<keyof IOrderData, string>>;

export interface IAppState {
	catalog: ICard[];
	basket: ICard[];
	basketList: IBasketItem[];
	order: IOrderData | null;
	preview: string | null;
}

export interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};