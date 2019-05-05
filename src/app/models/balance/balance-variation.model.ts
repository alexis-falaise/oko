import { Moment } from 'moment';
import * as moment from 'moment';

export class BalanceVariation {
    userId: string;
    date: Moment;
    amount: number;
    constructor(variation: Partial<BalanceVariation>) {
        Object.assign(this, variation);
        if (variation) {
            this.date = moment(variation.date);
        }
    }
}
