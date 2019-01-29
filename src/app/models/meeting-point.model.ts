export class MeetingPoint {
    adress: string;
    zip: string;
    city: string;
    country: string;
    id?: string;

    constructor(point: Partial<MeetingPoint> = {}) {
        Object.assign(this, point);
    }
}
