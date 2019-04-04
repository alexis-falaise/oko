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
    lastUpdate?: Update;
    id?: string;
    _id: string;

    /**Front-end helpers */
    authorView?: boolean;
    receiverView?: boolean;
    fromTrip?: boolean;
    fromRequest?: boolean;
    toTrip?: boolean;
    toRequest?: boolean;

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
            this.fromTrip = true;
        }
        if (this.isRequest(proposal.from)) {
            this.from = new Request(proposal.from);
            this.fromRequest = true;
        }
        if (this.isTrip(proposal.to)) {
            this.to = new Trip(proposal.to);
            this.toTrip = true;
        }
        if (this.isRequest(proposal.to)) {
            this.to = new Request(proposal.to);
            this.toRequest = true;
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

    /* Check the from & to properties type (Trip or Request)*/
    isFromTrip(): boolean {
        const isFromTrip = this.isTrip(this.from);
        this.fromTrip = isFromTrip;
        return isFromTrip;
    }

    isToTrip(): boolean {
        const isToTrip = this.isTrip(this.to);
        this.toTrip = isToTrip;
        return isToTrip;
    }

    isFromRequest(): boolean {
        const isFromRequest = this.isRequest(this.from);
        this.fromRequest = isFromRequest;
        return isFromRequest;
    }

    isToRequest(): boolean {
        const isToRequest = this.isRequest(this.to);
        this.toRequest = isToRequest;
        return isToRequest;
    }

    isTrip(object: any): boolean {
        return !!object['from'] && !!object['to'];
    }

    isRequest(object: any): boolean {
        return !!object['items'] && !!object['meetingPoint'];
    }

}
