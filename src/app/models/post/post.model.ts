import { User } from '@models/user.model';
import { Id } from '@models/id.model';
import { Moment } from 'moment';

export class Post {
    user: User;
    submitDate: Moment;
    expirationDate: Moment;

    /* Meta information */
    clicks?: number;
    views?: number;
    id?: Id;

    constructor(post: Partial<Post>) {
        Object.assign(this, post);
        this.user = new User(post.user);
    }
}
