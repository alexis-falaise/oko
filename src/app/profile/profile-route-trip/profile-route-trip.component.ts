import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as moment from 'moment';
import { coordDistance, Coords, round, airportsDistance, calculateTravelTime } from '@utils/math.util';

import { Trip } from '@models/post/trip.model';

@Component({
  selector: 'app-profile-route-trip',
  templateUrl: './profile-route-trip.component.html',
  styleUrls: ['./profile-route-trip.component.scss']
})
export class ProfileRouteTripComponent implements OnChanges {
  @Input() trip: Trip;
  @Input() focus = false;
  @Input() expanded = false;
  tripDistance: number;
  tripTimezoneDiff: number;
  tripTravelTime: string;
  moment = moment;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.trip) {
      this.trip = new Trip(changes.trip.currentValue);
      if (this.trip) {
        this.tripDistance = this.calculateDistance(this.trip);
        this.tripTimezoneDiff = this.calculateTimezoneDiff(this.trip);
        this.tripTravelTime = moment.duration(this.calculateTravelTime(this.trip), 'hours').humanize();
      }
    }
  }

  private calculateDistance(trip: Trip): number {
    return airportsDistance(trip.from.airport, trip.to.airport);
  }

  private calculateTimezoneDiff(trip: Trip): number {
    return trip.to.airport.timezone - trip.from.airport.timezone;
  }

  private calculateTravelTime(trip: Trip): number {
    return calculateTravelTime(trip.from.airport, trip.to.airport);
  }

}
