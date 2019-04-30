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

    // Front-end properties
    authorView?: boolean;
    formattedSendDate: string;
    formattedReceptionDate: string;
    formattedSightDate: string;
    avatar: boolean;

    constructor(message: Partial<Message>, user?: User) {
        Object.assign(this, message);
        if (message) {
            if (message._id) {
                this.id = message._id;
            }
            if (message.author) {
                this.author = new User(message.author);
            }
            if (message.sendDate) {
                this.formattedSendDate = this.formatDate(message.sendDate);
            }
            if (message.receptionDate) {
                this.formattedReceptionDate = this.formatDate(message.receptionDate);
            }
            if (message.sightDate) {
                this.formattedSightDate = this.formatDate(message.sightDate);
            }
            if (user) {
                const formattedUser = new User(user);
                this.authorView = this.isAuthor(formattedUser);
            }
        }
    }

    send() {
        this.sent = true;
        this.sendDate = moment();
    }

    markAsSeen() {
        this.seen = true;
        this.sightDate = moment();
        return this;
    }

    isAuthor(user: User): boolean {
        if (this.author) {
            return this.author.id === user.id;
        } else {
            return false;
        }
    }

    formatDate(date): string {
        let dateToFormat;
        dateToFormat = moment(date);
        return dateToFormat.isSame(moment(), 'd')
                ? dateToFormat.format('HH:mm')
                : dateToFormat.isSame(moment().subtract(1, 'days'), 'd')
                  ? `Hier - ${dateToFormat.format('HH:mm')}`
                  : dateToFormat.isAfter(moment().subtract(7, 'days'))
                    ? dateToFormat.format('ddd - HH:mm')
                    : dateToFormat.format('DD MMMM - HH:mm');
    }
}
