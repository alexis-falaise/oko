export class Airport {
    label: string;
    name: string;
    code: string;
    id?: number;

    constructor(airport: Partial<Airport>) {
        Object.assign(this, airport);
    }
}
