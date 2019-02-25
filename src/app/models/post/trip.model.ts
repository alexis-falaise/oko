import { Location } from '@models/location.model';
import { Post } from '@models/post/post.model';
import { Moment } from 'moment';
import * as moment from 'moment';
import { Luggage } from '@models/luggage.model';

export class Trip extends Post {
    from: Location;
    to: Location;
    departureDate: Moment;
    date: Moment;

    /* Transportation constraints */
    luggages?: Array<Luggage>;
    airportDrop: boolean;
    cabinOnly: boolean;
    bonus: number;

    constructor(trip: Partial<Trip>) {
        super(trip);
        Object.assign(this, trip);
        if (trip.date) {
            this.date = moment(trip.date);
        }
        if (trip.departureDate) {
            this.departureDate = moment(trip.departureDate);
        }
        if (trip.from) {
            this.from = new Location(trip.from);
        }
        if (trip.to) {
            this.to = new Location(trip.to);
        }
    }
}
