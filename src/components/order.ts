import {Form} from "./common/form";
import {ensureElement} from "../utils/utils";
import {EventEmitter} from "./base/events";
import {IFormContacts, IFormPayment, IOrderData, PaymentMethod} from "../types";
import {IEvents} from "./base/events";

export class FormPayment extends Form<IFormPayment> {
    protected _onlineButton: HTMLButtonElement;
    protected _offlineButton: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        
        this._onlineButton = this.container.elements.namedItem('card') as HTMLButtonElement;
		this._offlineButton = this.container.elements.namedItem('cash') as HTMLButtonElement;
		
        if (this._onlineButton) {
            this._onlineButton.addEventListener('click', () => {
                events.emit('payment:change', {
                    payment: this._onlineButton.name,
                    button: this._onlineButton,
                });
            });
        }

        if (this._offlineButton) {
            this._offlineButton.addEventListener('click', () => {
                events.emit('payment:change', {
                    payment: this._offlineButton.name,
                    button: this._offlineButton,
                });
            });
        }   
    }

    set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value = value;
	}

    togglePayment(value: HTMLElement) {
		this.cancelPayment();
		this.toggleClass(value, 'button_alt-active', true);
	}

	cancelPayment() {
		this.toggleClass(this._onlineButton, 'button_alt-active', false);
		this.toggleClass(this._offlineButton, 'button_alt-active', false);
	}
    }

export class FormContacts extends Form<IFormContacts> {
    constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}
    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
        }
    
    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
        }
}
    