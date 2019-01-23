import { User } from '@models/user.model';
import { Moment } from 'moment';

export class Post {
    user?: User;
    submitDate?: Moment;
    expirationDate?: Moment;

    /* Meta information */
    clicks?: number;
    views?: number;
    id?: number;

    constructor(post: Partial<Post>) {
        Object.assign(this, post);
        if (post.user) {
            this.user = new User(post.user);
        }
    }
}
