import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';

import { Trip } from '@models/post/trip.model';
import { Route } from '@models/route.model';

import { PexelsService } from '@core/pexels.service';
import { PostService } from '@core/post.service';

@Component({
  selector: 'app-profile-route',
  templateUrl: './profile-route.component.html',
  styleUrls: ['./profile-route.component.scss']
})
export class ProfileRouteComponent implements OnInit {
  background: string;
  trip: Trip;
  routeList: Array<Trip>;
  expandedTrip: Trip;
  completeRoute = false;
  userId: string;

  constructor(
    private pexelsService: PexelsService,
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  get backgroundImage() {
    return `url(${this.background})`;
  }

  ngOnInit() {
    // this.route.data.subscribe((resolved) => {
    //   this.trip = resolved.route.trip;
    //   this.routeList = resolved.route.route;
    //   this.pexelsService.getBackgroundPicture(this.trip.to.airport.country, 'portrait')
    //   .subscribe((picture) => {
    //     this.background = picture;
    //   });
    // });
    this.route.params.subscribe((params) => {
        this.userId = params.id;
        if (params.trip) {
        this.postService.getTripRoute(params.trip)
        .subscribe((route: Route) => {
          this.trip = new Trip(route.trip);
          this.routeList = route.route.map(trip => new Trip(trip));

          this.pexelsService.getBackgroundPicture(this.trip.to.airport.country, 'portrait')
          .subscribe((picture) => {
            this.background = picture;
          });
          this.generateRouteList(this.routeList);
        });
      } else {
        if (params.id) {
          this.postService.getTripByAuthor(params.id)
          .subscribe((trips: Array<Trip>) => {
            const filteredTrips = trips.map(trip => new Trip(trip))
            .filter(trip => moment(trip.departureDate).isAfter(moment()))
            .sort((trip, next) => moment(trip.date).isBefore(next.departureDate) ? - 1 : 1);
            this.trip = filteredTrips[0];
            this.routeList = filteredTrips;
            this.completeRoute = true;
          });
        }
      }
    });
  }

  expandTrip(trip: Trip) {
    this.expandedTrip = this.expandedTrip === trip ? null : trip;
  }

  private generateRouteList(list: Array<Trip>) {
    const before = list.filter(trip => moment(trip.date).isBefore(this.trip.departureDate));
    const after = list.filter(trip => moment(trip.departureDate).isAfter(this.trip.date));
    before.push(this.trip);
    this.routeList = before.concat(after);
  }

}
