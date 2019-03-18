import { User } from '@models/user.model';
import { Moment } from 'moment';
import * as moment from 'moment';
export class Message {
    author: User;
    content: string;
    sent?: boolean;
    sendDate?: Moment;
    received?: boolean;
    receptionDate?: Moment;
    sightDate?: Moment;
    seen?: boolean;
    id?: string;
    _id?: string;
    constructor(message: Partial<Message>) {
        Object.assign(this, message);
        if (message._id) {
            this.id = message._id;
        }
    }

    send() {
        this.sent = true;
        this.sendDate = moment();
    }
}
