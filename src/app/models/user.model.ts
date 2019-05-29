import { Description } from '@models/description.model';
import { MeetingPoint } from '@models/meeting-point.model';
import { Session } from '@models/app/session.model';
import { BankDetails } from './balance/bank-details.model';
import { Earning } from './balance/earning.model';
import { Withdrawal } from '@models/balance/withdrawal.model';

import { Moment } from 'moment';
import * as moment from 'moment';

export class User {
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    birthdate?: Moment;
    password?: string;
    avatar?: string;
    description?: Description;
    trips?: number;
    requests?: number;
    ratings?: [number];
    address?: MeetingPoint;

    // Balance
    accounts: [BankDetails];
    balance: number;
    withdrawals: [Withdrawal];
    earnings: [Earning];

    // Landing page properties
    comment?: string;
    guest?: boolean;
    tester?: boolean;

    // App properties
    secure: boolean;
    sessions: Array<Session>;
    admin: boolean;
    signinDate: Moment;
    socialToken?: string;
    socialProvider?: string;

    // Front-end helpers
    lastConnection: Moment;
    formattedLastConnection: string;
    formattedSigninDate: string;
    isConnected: boolean;
    rating: number;

    // Database id
    id?: string;
    _id: string;
    constructor(user: Partial<User> = {}) {
        Object.assign(this, user);
        if (user.description) {
            this.description = new Description(user.description);
        }
        if (!user.trips) {
            this.trips = 0;
        }
        if (!user.ratings || user.ratings && !user.ratings.length) {
            this.ratings = [5];
            this.rating = Math.round(this.ratings.reduce((acc, value) => acc + value, 0) / this.ratings.length);
        }
        if (user._id) {
            this.id = user._id;
        }
        if (user.sessions && user.sessions.length) {
            this.sessions = user.sessions.map(session => new Session(session));
            const lastConnection = user.sessions[user.sessions.length - 1];
            this.lastConnection = lastConnection.end;
            this.formattedLastConnection = this.formatDate(lastConnection.end);
            this.isConnected = lastConnection.open;
        }
        if (user.signinDate) {
            this.formattedSigninDate = this.formatDate(user.signinDate);
        }
    }

    formatDate(date): string {
        let dateToFormat: Moment;
        dateToFormat = moment(date);
        return dateToFormat.isSame(moment(), 'd')
                ? dateToFormat.fromNow()
                : dateToFormat.isSame(moment().subtract(1, 'days'), 'd')
                  ? dateToFormat.format('[hier] [à] HH:mm')
                  : dateToFormat.isAfter(moment().subtract(7, 'days'))
                    ? dateToFormat.format('ddd à HH:mm')
                    : dateToFormat.format('[le] DD MMMM [à] HH:mm');
    }
}
