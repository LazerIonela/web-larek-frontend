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
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IBasketItem {
    id: string;
    price: number;
    title: string;
}

export interface IForm {
    valid: boolean;
    errors: string[];
}

export type PaymentMethod = 'online' | 'offline';

export interface IFormPayment extends IForm {
    payment: PaymentMethod;
	address: string;
}

export interface IFormContacts extends IForm {
    email: string;
    phone: string;
}

export interface IOrderItems {
    total: number;
    items: string[];
}

export interface IOrderData extends IOrderItems {
	payment: PaymentMethod;
    email: string;
	phone: string;
	address: string;
}

export type FormErrors = Partial<Record<keyof IOrderData, string>>;

export interface IAppState {
    catalog: ICard[];
    basket: IBasketItem[];
    order: IOrderData | null;
    preview: string | null;
}


