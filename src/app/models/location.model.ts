import { Airport } from '@models/airport.model';
import { Id } from '@models/id.model';

export class Location {
    label: string;
    airport: Airport;
    timezone: number;
    id: Id;

    constructor(location: Partial<Location>) {
        Object.assign(this, location);
    }
}
