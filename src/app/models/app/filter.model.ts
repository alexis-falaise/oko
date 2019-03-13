import { Moment } from 'moment';

export class Filter {
    item?: string;
    location: string;
    beforeDate?: Moment;
    afterDate?: Moment;
    closed?: boolean;
    airportPickup?: boolean;
    urgent?: boolean;
    open?: boolean;
    accepted?: boolean;
    validated?: boolean;
    city?: string;
    country?: string;

    constructor(filter: Partial<Filter> = {}) {
        Object.assign(this, filter);
    }
}
