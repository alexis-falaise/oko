import { Trip } from '@models/post/trip.model';

export interface Route {
    trip: Trip;
    route: Array<Trip>;
}
