import { Location } from '@models/location.model';
import { Post } from '@models/post/post.model';
import { Moment } from 'moment';

export class Trip extends Post {
    from: Location;
    to: Location;
    date: Moment;

    /* Transportation constraints */
    weight: number;
    height: number;
    width: number;
    depth: number;
    airportDrop: boolean;
    cabinOnly: boolean;

    constructor(trip: Partial<Trip>) {
        super(trip);
        Object.assign(this, trip);
        this.from = new Location(trip.from);
        this.to = new Location(trip.to);
    }
}
