import { User } from '@models/user.model';
import { Moment } from 'moment';

export class Message {
    author: User;
    content: string;
    sendDate?: Moment;
    receptionDate?: Moment;
    openingDate?: Moment;
    sent?: boolean;
    received?: boolean;
    opened?: boolean;
    id?: string;
    _id?: string;
    constructor(message: Partial<Message>) {
        Object.assign(this, message);
        if (message._id) {
            this.id = message._id;
        }
    }
}
