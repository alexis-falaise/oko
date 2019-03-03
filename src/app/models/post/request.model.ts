import { Moment } from 'moment';
import * as moment from 'moment';
import { User } from '@models/user.model';
import { Post } from '@models/post/post.model';
import { Item } from '@models/item.model';
import { MeetingPoint } from '@models/meeting-point.model';
import { Location } from '@models/location.model';
import { Trip } from './trip.model';

export class Request extends Post {
    items: Array<Item>;
    location: Location;
    meetingPoint?: MeetingPoint;
    airportPickup?: boolean;
    cabinOnly?: boolean;
    urgent?: boolean;
    urgentDetails: {
        explaination: string;
        date: Moment;
    };
    handler?: User;
    bonus?: number;
    trip?: Trip;
    closed?: boolean;
    accepted?: boolean;
    validated?: boolean;
    outdated?: boolean;
    own?: boolean;
    handlerView: boolean;
    paid?: boolean;

    constructor(request: Partial<Request> = {}) {
        super(request);
        Object.assign(this, request);
        if (request.items) {
            this.items = request.items.map(item => new Item(item));
        }
        if (request.meetingPoint) {
            this.meetingPoint = new MeetingPoint(request.meetingPoint);
        }
        if (request.location) {
            this.location = new Location(request.location);
        }
        if (request.urgentDetails && request.urgentDetails.date) {
            this.urgentDetails.date = moment(request.urgentDetails.date);
            this.outdated = moment(request.urgentDetails.date).isBefore(moment.now());
        }
        if (request.trip) {
            this.trip = new Trip(request.trip);
        }
        this.cabinOnly = this.isCabinOnly();
    }

    isCabinOnly(): boolean {
        let fitsCabin = true;
        if (this.items) {
            this.items.forEach(item => {
                if (!item.cabinOnly) {
                    fitsCabin = false;
                }
            });
        }
        return fitsCabin;
    }

    isOwn(user: User): boolean {
        if (user.id === this.user.id) {
            this.own = true;
            return true;
        } else {
            this.own = false;
            return false;
        }
    }

    isHandledBy(user: User): boolean {
        if ((this.handler && this.handler.id === user.id)
            || (this.trip.user.id === user.id)) {
            this.handlerView = true;
            return true;
        } else {
            this.handlerView = false;
            return false;
        }
    }
}
