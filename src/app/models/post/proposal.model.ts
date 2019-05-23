import { Post } from '@models/post/post.model';
import { User } from '@models/user.model';
import { MeetingPoint } from '@models/meeting-point.model';

import { Moment } from 'moment';
import * as moment from 'moment';
import { Trip } from './trip.model';
import { Request } from './request.model';

export class Update {
    date: Moment;
    author: User;
    type: 'create' | 'meeting' | 'bonus' | 'accept' | 'refuse' | 'close' | 'validate' | 'pay';
    bonusDelta: number;
    seen: boolean;
    sightDate: Moment;

    constructor(update: Partial<Update>) {
        Object.assign(this, update);
    }
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
    id?: string;
    _id: string;

    /**Front-end helpers */
    authorView?: boolean;
    receiverView?: boolean;
    fromTrip?: boolean;
    fromRequest?: boolean;
    toTrip?: boolean;
    toRequest?: boolean;
    outdated?: boolean;
    lastUpdate?: Update;

    constructor(proposal: Partial<Proposal>, user?: User) {
        const now = moment();
        Object.assign(this, proposal);
        if (proposal._id) {
            this.id = proposal._id;
        }
        if (proposal.updates && proposal.updates.length) {
            this.lastUpdate = proposal.updates[proposal.updates.length - 1];
        } else {
            this.lastUpdate = new Update({
                date : this.date,
                author: this.author,
                type: 'create',
            });
        }
        if (proposal.from && proposal.from.user) {
            this.author = proposal.from.user;
        }
        if (proposal.to && proposal.to.user) {
            this.receiver = proposal.to.user;
        }
        if (this.isTrip(proposal.from)) {
            const from = new Trip(proposal.from);
            this.from = from;
            this.fromTrip = true;
            this.outdated = moment(from.date).isBefore(now);
        }
        if (this.isRequest(proposal.from)) {
            const from = new Request(proposal.from);
            this.from = from;
            this.fromRequest = true;
            this.outdated = from.urgent && moment(from.urgentDetails.date).isBefore(now);
        }
        if (this.isTrip(proposal.to)) {
            const to = new Trip(proposal.to);
            this.to = to;
            this.toTrip = true;
            this.outdated = moment(to.date).isBefore(now);
        }
        if (this.isRequest(proposal.to)) {
            const to = new Request(proposal.to);
            this.to = to;
            this.toRequest = true;
            this.outdated = to.urgent && moment(to.urgentDetails.date).isBefore(now);
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
