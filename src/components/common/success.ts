import {Component} from "../base/component";
import {ensureElement} from "../../utils/utils";
import {IOrderSuccess, ISuccessActions } from "../../types/index";

export class Success extends Component<IOrderSuccess> {
    protected _close: HTMLElement;
    protected _totalDescription: HTMLParagraphElement;

    constructor(container: HTMLElement, totalDescription: string, actions: ISuccessActions) {
        super(container);

        this._close = ensureElement<HTMLElement>('.order-success__close', this.container);
        this._totalDescription = ensureElement<HTMLParagraphElement>('.order-success__description', container);
        this._totalDescription.textContent = totalDescription;
        
        if (actions?.onClick) {
            this._close.addEventListener('click', actions.onClick);
        }
    }
    set total(value: string) {
        this.setText(this._totalDescription, `Списано ${value} синапсов`); 
    }
}