export interface IModalData {
    content: HTMLElement;
}

export interface ISuccess {
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

export interface IBasket {
    items: Map<string, number>;
    totalprice: number;
    add(id: string): void;
    remove(id: string): void;
}

export interface IForm {
    valid: boolean;
    errors: string[];
}

export interface IFormPayment extends IForm {
    payment: PaymentMethod;
	address: string;
}

export interface IFormContacts extends IForm {
    email: string;
    phone: string;
}

export interface IClientData extends IForm {
	payment: PaymentMethod;
	address: string;
	email: string;
	phone: string;
}

export type PaymentMethod = 'Онлайн' | 'При получении';