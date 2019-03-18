import { Post } from '@models/post/post.model';
import { User } from '@models/user.model';
import { MeetingPoint } from '@models/meeting-point.model';

import { Moment } from 'moment';
import { Trip } from './trip.model';

export class Update {
    date: Moment;
    author: User;
    type: string;
    bonusDelta: number;
    seen: boolean;
    sightDate: Moment;
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
    airportPickup: boolean;
    meetingPoint: MeetingPoint;
    updates: [Update];
    seen: boolean;
    sightDate: Moment;
    authorView?: boolean;
    lastUpdate?: Update;
    id?: string;
    _id: string;
    constructor(proposal: Partial<Proposal>) {
        Object.assign(this, proposal);
        if (proposal._id) {
            this.id = proposal._id;
        }
        if (proposal.updates && proposal.updates.length) {
            this.lastUpdate = proposal.updates[proposal.updates.length - 1];
        }
    }

    isAuthor(user: User) {
        if (this.author) {
            this.authorView = this.author.id === user.id;
            return this.author.id === user.id;
        } else {
            return false;
        }
    }

    isFromTrip() {
        return this.from instanceof Trip;
    }

}
