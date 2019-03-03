import { Post } from '@models/post/post.model';
import { Moment } from 'moment';
import { User } from '@models/user.model';

export class Update {
    date: Moment;
    author: User;
    type: string;
    bonusDelta: number;
}

export class Proposal {
    from: Post;
    to: Post;
    author: User;
    date: Moment;
    accepted: boolean;
    refused: boolean;
    validated: boolean;
    paid: boolean;
    closed: boolean;
    bonus: number;
    updates: [Update];
    constructor(proposal: Partial<Proposal>) {
        Object.assign(this, proposal);
    }
}
