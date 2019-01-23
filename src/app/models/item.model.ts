import { Link } from '@models/link.model';
export class Item {
    label: string;
    description?: string;
    link?: Link;
    photo?: Array<string>;
    width?: number;
    height?: number;
    depth?: number;
    weight?: number;
    cabinOnly?: boolean;
    id?: number;

    constructor(item: Partial<Item>) {
        Object.assign(this, item);
    }
}
