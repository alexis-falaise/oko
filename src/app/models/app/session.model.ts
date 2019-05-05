import { Moment } from 'moment';
import * as moment from 'moment';

export class Session {
    userId: string;
    start: Moment;
    end: Moment;
    open: boolean;
    constructor(session: Partial<Session>) {
        Object.assign(this, session);
        if (session) {
            this.start = moment(session.start);
            this.end = moment(session.end);
        }
    }
}
