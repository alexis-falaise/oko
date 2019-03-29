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

    /** Front-end properties */
    weight: number;
    availableSpace: number;
    large: boolean;

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
        if (trip.luggages) {
            this.weight = this.calculateWeight(trip.luggages);
            this.availableSpace = this.calculateSpace(trip.luggages);
            this.cabinOnly = this.isCabinOnly(trip.luggages);
            this.large = this.isLargeItemsReady(trip.luggages);
        }
    }

    calculateWeight(luggages: Array<Luggage>): number {
        return luggages.reduce((acc: number, luggage: Luggage) => acc + luggage.weight, 0) as number;
    }

    calculateSpace(luggages: Array<Luggage>): number {
        const filtered = luggages.filter(luggage => !luggage.large);
        const average = filtered
        .reduce((acc: number, luggage: Luggage) => acc + luggage.availableSpace, 0) / filtered.length as number;
        return Math.floor(average);
    }

    isCabinOnly(luggages: Array<Luggage>): boolean {
        return luggages.reduce((acc: boolean, luggage: Luggage) => acc = luggage.cabin, false);
    }

    isLargeItemsReady(luggages: Array<Luggage>): boolean {
        return !!luggages.find(luggage => luggage.large);
    }
}
