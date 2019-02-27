import { User } from '@models/user.model';
import { Moment } from 'moment';
import * as moment from 'moment';

export class Post {
    user?: User;
    submitDate?: Moment;
    expirationDate?: Moment;
    proposals?: [Post];

    /* Meta information */
    clicks?: number;
    views?: number;
    id?: string;
    _id?: string;

    constructor(post: Partial<Post>) {
        Object.assign(this, post);
        if (post.user) {
            this.user = new User(post.user);
        }
        if (post.submitDate) {
            this.submitDate = moment(post.submitDate);
        }
        if (post.expirationDate) {
            this.expirationDate = moment(post.expirationDate);
        }
        if (post._id) {
            this.id = post._id;
        }
    }
}
