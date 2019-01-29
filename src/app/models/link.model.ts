export class Link {
    path: string;
    label: string;
    icon: string;
    id?: string;

    constructor(link: Partial<Link> = {}) {
        Object.assign(this, link);
    }
}
