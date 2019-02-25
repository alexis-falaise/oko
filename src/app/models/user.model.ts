import { Description } from '@models/description.model';
import { MeetingPoint } from './meeting-point.model';
export class User {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    avatar?: string;
    description?: Description;
    trips?: number;
    requests?: number;
    rating?: number;
    address?: MeetingPoint;
    id?: string;

    constructor(user: Partial<User> = {}) {
        Object.assign(this, user);
        if (user.description) {
            this.description = new Description(user.description);
        }
        if (!user.trips) {
            this.trips = 0;
        }
    }
}
