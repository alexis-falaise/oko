export class Link {
    path: string;
    label: string;
    icon?: string;
    badge?: number;
    id?: string;

    constructor(link: Partial<Link> = {}) {
        Object.assign(this, link);
    }
}
