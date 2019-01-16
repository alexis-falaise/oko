import { Link } from '@models/link.model';
import { Id } from '@models/id.model';

export class Item {
    description: string;
    link: Link;
    photo: Array<string>;
    width: number;
    height: number;
    depth: number;
    weight: number;
    cabinOnly: boolean;
    id: Id;

    constructor(object: Partial<Item>) {
        Object.assign(this, object);
    }
}
