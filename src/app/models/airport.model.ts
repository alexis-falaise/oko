export class Airport {
    label: string;
    name?: string;
    city?: string;
    country?: string;
    code?: string;
    icao?: string;
    latitude?: number;
    longitude?: number;
    altitude?: number;
    timezone?: number;
    dst?: string;
    id?: string;

    constructor(airport: Partial<Airport> = {}) {
        Object.assign(this, airport);
    }
}
