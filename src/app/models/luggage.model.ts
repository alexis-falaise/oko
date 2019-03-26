export class Luggage {
    weight: number;
    height?: number;
    width?: number;
    depth?: number;
    cabin: boolean;
    full: boolean;
    large: boolean;
    availableSpace?: number;
    id?: string;
    constructor(luggage: Partial<Luggage> = {}) {
        Object.assign(this, luggage);
    }
}
