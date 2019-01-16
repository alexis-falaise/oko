import { Description } from '@models/description.model';
import { Id } from '@models/id.model';

export class User {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    avatar?: string;
    description?: Description;
    trips?: number;
    rating?: number;
    id?: Id;

    constructor(user: Partial<User>) {
        Object.assign(this, user);
        this.description = new Description(user.description);
        if (!user.trips) {
            this.trips = 0;
        }
    }
}
