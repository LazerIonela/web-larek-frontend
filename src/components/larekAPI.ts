import { Api, ApiListResponse } from './base/api';
import { ICard, IOrderData, IOrderSuccess } from '../types';

export interface ILarekAPI {
    getCardList: () => Promise<ICard[]>;
    getCard: (id: string) => Promise<ICard>;  
    postOrder: (order: IOrderData) => Promise<IOrderSuccess>;
}

export class LarekAPI extends Api implements ILarekAPI {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getCardList(): Promise<ICard[]> {
        return this.get('/product').then((data: ApiListResponse<ICard>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }

    getCard(id: string): Promise<ICard> {
        return this.get(`/product/${id}`).then(
            (item: ICard) => ({
                ...item,
                image: this.cdn + item.image,
            })
        );
    }

    postOrder(order: IOrderData): Promise<IOrderSuccess> {
		return this.post('/order', order).then((data: IOrderSuccess) => data);
	}
}