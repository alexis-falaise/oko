import { Id } from '@models/id.model';
import { Location } from '@models/location.model';
import { Post } from '@models/post/post.model';
import { Moment } from 'moment';

export class Trip extends Post {
    from: Location;
    to: Location;
    date: Moment;
    airportDrop: boolean;
    cabinOnly: boolean;
    id?: Id;

    constructor(trip: Partial<Trip>) {
        super(trip);
        Object.assign(this, trip);
        this.from = new Location(trip.from);
        this.to = new Location(trip.to);
    }
}
