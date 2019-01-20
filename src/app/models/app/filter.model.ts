export class Filter {
    item: string;
    location: string;

    constructor(filter: Partial<Filter>) {
        Object.assign(this, filter);
    }
}
