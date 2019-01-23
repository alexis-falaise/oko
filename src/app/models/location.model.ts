import { Airport } from '@models/airport.model';
export class Location {
    label: string;
    airport?: Airport;
    timezone?: number;
    id?: number;

    constructor(location: Partial<Location>) {
        Object.assign(this, location);
        if (location.airport) {
            this.airport = new Airport(location.airport);
        }
    }
}
