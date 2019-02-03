import { Location } from '@models/location.model';
import { Post } from '@models/post/post.model';
import { Moment } from 'moment';
import * as moment from 'moment';
import { Luggage } from '@models/luggage.model';

export class Trip extends Post {
    from: Location;
    to: Location;
    date: Moment;

    /* Transportation constraints */
    luggages?: Array<Luggage>;
    airportDrop: boolean;
    cabinOnly: boolean;

    constructor(trip: Partial<Trip>) {
        super(trip);
        Object.assign(this, trip);
        if (this.date) {
            this.date = moment(trip.date);
        }
        if (this.from) {
            this.from = new Location(trip.from);
        }
        if (this.to) {
            this.to = new Location(trip.to);
        }
    }
}
