import { User } from '@models/user.model';
import { Id } from '@models/id.model';

export class Post {
    user: User;
    submitDate: Date;
    expirationDate: Date;
    clicks: number;
    views: number;
    id: Id;

    constructor(post: Partial<Post>) {
        Object.assign(this, post);
    }
}
