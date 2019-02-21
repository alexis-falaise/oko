export class Luggage {
    weight: number;
    height?: number;
    width?: number;
    depth?: number;
    cabin: boolean;
    full: boolean;
    id?: string;
    constructor(luggage: Partial<Luggage> = {}) {
        Object.assign(this, luggage);
    }
}