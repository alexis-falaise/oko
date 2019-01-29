import { Description } from '@models/description.model';
export class User {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    avatar?: string;
    description?: Description;
    trips?: number;
    rating?: number;
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
