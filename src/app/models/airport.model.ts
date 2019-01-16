import { Id } from '@models/id.model';

export class Airport {
    label: string;
    name: string;
    code: string;
    id?: Id;

    constructor(airport: Partial<Airport>) {
        Object.assign(this, airport);
    }
}
