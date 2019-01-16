import { Id } from '@models/id.model';

export class MeetingPoint {
    adress: string;
    zip: string;
    city: string;
    country: string;
    id: Id;

    constructor(point: Partial<MeetingPoint>) {
        Object.assign(this, point);
    }
}
