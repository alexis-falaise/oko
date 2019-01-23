export class MeetingPoint {
    adress: string;
    zip: string;
    city: string;
    country: string;
    id?: number;

    constructor(point: Partial<MeetingPoint>) {
        Object.assign(this, point);
    }
}
