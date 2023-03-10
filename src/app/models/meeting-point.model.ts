import { Moment } from 'moment';
export class MeetingPoint {
    address?: string;
    zip?: string;
    city: string;
    country: string;
    date?: Moment;
    id?: string;

    constructor(point: Partial<MeetingPoint> = {}) {
        Object.assign(this, point);
    }
}
