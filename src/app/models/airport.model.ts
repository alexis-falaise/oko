export class Airport {
    label: string;
    name: string;
    code: string;
    id?: string;

    constructor(airport: Partial<Airport>) {
        Object.assign(this, airport);
    }
}
