import { User } from '@models/user.model';
import { Moment } from 'moment';
import * as moment from 'moment';
export class Message {
    // Properties to be filled client-side
    content?: string;
    sent?: boolean;
    sendDate?: Moment;

    // Properties to be filled server-side
    author?: User;
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
