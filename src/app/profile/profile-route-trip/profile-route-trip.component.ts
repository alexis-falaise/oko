import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as moment from 'moment';
import { coordDistance, Coords, round } from '@utils/math.util';

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
  moment = moment;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.trip) {
      this.trip = new Trip(changes.trip.currentValue);
      if (this.trip) {
        this.tripDistance = this.calculateDistance(this.trip);
        this.tripTimezoneDiff = this.calculateTimezoneDiff(this.trip);
      }
    }
  }

  private calculateDistance(trip: Trip): number {
    const originAirport = trip.from.airport;
    const origin: Coords = {
      latitude: originAirport.latitude,
      longitude: originAirport.longitude,
      altitude: originAirport.altitude,
    };
    const destinationAirport = trip.to.airport;
    const destination: Coords = {
      latitude: destinationAirport.latitude,
      longitude: destinationAirport.longitude,
      altitude: destinationAirport.altitude,
    };
    return round(coordDistance(origin, destination), 2);
  }

  private calculateTimezoneDiff(trip: Trip) {
    return trip.to.airport.timezone - trip.from.airport.timezone;
  }

}
