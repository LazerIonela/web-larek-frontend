import { Component } from './base/component';
import { categoryMap } from '../utils/constants';
import { ensureElement } from '../utils/utils';
import { ICard, ICardActions } from '../types/index';

export class Card extends Component<ICard> {
	protected _description?: HTMLElement;
	protected _image: HTMLImageElement;
	protected _title: HTMLElement;
	protected _category: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._description = container.querySelector('.card__text');
		this._image = container.querySelector('.card__image');
		this._title = container.querySelector('.card__title');
		this._category = container.querySelector('.card__category');
		this._price = container.querySelector('.card__price');
		this._button = container.querySelector('.card__button');

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set button(value: string) {
		this.setText(this._button, value);
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	get description(): string {
		return this._description.textContent || '';
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set category(value: string) {
		this.setText(this._category, value);
		this.toggleClass(this._category, categoryMap.get(value), true);
	}

	get category(): string {
		return this._category.textContent || '';
	}

	set price(value: string) {
		if (value) {
			this.setText(this._price, `${value} синапсов`);
		} else {
			this.setText(this._price, `Бесценно`);
			this.setDisabled(this._button, true);
		}
	}

	get price(): string {
		return this._price.textContent || '';
	}
}

export class BasketItem extends Card {
	protected _index: HTMLElement;
	protected _deleteButton: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._index = ensureElement<HTMLElement>(
			'.basket__item-index',
			this.container
		);
		this._deleteButton = container.querySelector('.basket__item-delete');

		if (actions?.onClick) {
			this._deleteButton.addEventListener('click', actions.onClick);
		}
	}

	setIndex(index: number) {
		this._index.textContent = (index + 1).toString();
	}
}
