import { Post } from '@models/post/post.model';
import { User } from '@models/user.model';
import { MeetingPoint } from '@models/meeting-point.model';

import { Moment } from 'moment';
import { Trip } from './trip.model';
import { Request } from './request.model';

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
    receiver: User;
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
        if (this.isTrip(proposal.from)) {
            this.from = new Trip(proposal.from);
        }
        if (this.isRequest(proposal.from)) {
            this.from = new Request(proposal.from);
        }
        if (this.isTrip(proposal.to)) {
            this.to = new Trip(proposal.to);
        }
        if (this.isRequest(proposal.to)) {
            this.to = new Request(proposal.to);
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

    /* Check for the from and to properties, defining a trip */
    isFromTrip(): boolean {
        return this.isTrip(this.from);
    }

    isToTrip(): boolean {
        return this.isTrip(this.to);
    }

    isFromRequest(): boolean {
        return this.isRequest(this.from);
    }

    isToRequest(): boolean {
        return this.isRequest(this.to);
    }

    isTrip(object: any): boolean {
        return !!object['from'] && !!object['to'];
    }

    isRequest(object: any): boolean {
        return !!object['items'] && !!object['meetingPoint'];
    }

}
