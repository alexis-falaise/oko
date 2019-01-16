import { Id } from '@models/id.model';

export class Link {
    path: string;
    label: string;
    id: Id;

    constructor(link: Partial<Link>) {
        Object.assign(this, link);
    }
}
