import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';

import { UserService } from '@core/user.service';
import { PostService } from '@core/post.service';

import { Trip } from '@models/post/trip.model';

@Component({
  selector: 'app-account-trip',
  templateUrl: './account-trip.component.html',
  styleUrls: ['./account-trip.component.scss']
})
export class AccountTripComponent implements OnInit {
  trips: Array<Trip> = null;

  constructor(
    private postService: PostService,
    private userService: UserService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.userService.getCurrentUser()
    .subscribe(user => {
      if (user) {
        this.postService.getTripByAuthor(user.id)
        .subscribe(trips => {
          if (trips) {
            this.trips = trips.map(trip => new Trip(trip)).sort((a, b) => moment(a.date).isBefore(b.date) ? -1 : 1);
          }
        });
      }
    });
  }

  newTrip() {
    this.router.navigate(['/post/trip/new']);
  }

  remove(index: number) {
    this.trips.splice(index, 1);
  }

}
