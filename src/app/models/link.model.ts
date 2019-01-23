export class Link {
    path: string;
    label: string;
    id?: number;

    constructor(link: Partial<Link>) {
        Object.assign(this, link);
    }
}
