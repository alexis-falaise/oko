import { User } from '@models/user.model';

export class Deal {
    users?: [User];
    bonus?: number;
    acceptances?: [string];
    refusals?: [string];
    accepted?: boolean;
    refused?: boolean;
    id?: string;
    _id?: string;
    constructor(deal: Partial<Deal>) {
        Object.assign(this, deal);
        if (deal._id) {
            this.id = deal._id;
        }
    }

    accept(user: User) {
        if (!this.hasAccepeted(user)) {
            this.acceptances.push(user.id);
        }
    }

    refuse(user: User) {
        if (!this.hasRefused(user)) {
            this.refusals.push(user.id);
        }
    }

    hasAccepeted(user: User): boolean {
        return this.acceptances.findIndex(acceptance => acceptance === user.id) !== -1;
    }

    hasRefused(user: User): boolean {
        return this.refusals.findIndex(refusal => refusal === user.id) !== -1;
    }
}
