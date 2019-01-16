import { Id } from '@models/id.model';
import { Location } from '@models/location.model';
import { Post } from '@models/post/post.model';

export class Trip extends Post {
    from: Location;
    to: Location;
    date: Date;
    airportDrop: boolean;
    cabinOnly: boolean;
    id: Id;

    constructor(trip: Partial<Trip>) {
        super(trip);
        Object.assign(this, trip);
    }
}
