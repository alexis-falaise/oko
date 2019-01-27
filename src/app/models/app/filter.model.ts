import { Moment } from 'moment';

export class Filter {
    item?: string;
    location: string;
    beforeDate?: Moment;
    afterDate?: Moment;

    constructor(filter: Partial<Filter>) {
        Object.assign(this, filter);
    }
}
