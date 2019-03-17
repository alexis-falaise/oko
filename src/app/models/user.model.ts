import { Description } from '@models/description.model';
import { MeetingPoint } from './meeting-point.model';
import { Moment } from 'moment';
export class User {
    firstname: string;
    lastname: string;
    email: string;
    birthdate?: Moment;
    password: string;
    avatar?: string;
    description?: Description;
    trips?: number;
    requests?: number;
    ratings?: [number];
    address?: MeetingPoint;
    // Landing page properties
    comment?: string;
    guest?: boolean;
    tester?: boolean;
    // App properties
    secure: boolean;
    // Database id
    id?: string;
    _id: string;
    constructor(user: Partial<User> = {}) {
        Object.assign(this, user);
        if (user.description) {
            this.description = new Description(user.description);
        }
        if (!user.trips) {
            this.trips = 0;
        }
        if (!user.ratings || user.ratings && !user.ratings.length) {
            this.ratings = [5];
        }
        if (user._id) {
            this.id = user._id;
        }
    }
}
