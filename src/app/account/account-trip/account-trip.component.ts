import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';

import { UserService } from '@core/user.service';
import { PostService } from '@core/post.service';

import { Trip } from '@models/post/trip.model';
import { UiService } from '@core/ui.service';

@Component({
  selector: 'app-account-trip',
  templateUrl: './account-trip.component.html',
  styleUrls: ['../account-post.component.scss']
})
export class AccountTripComponent implements OnInit {
  trips: Array<Trip> = [];
  expiredTrips: Array<Trip> = [];
  hasDraft = false;
  loading = false;

  constructor(
    private postService: PostService,
    private userService: UserService,
    private uiService: UiService,
    private router: Router,
  ) { }

  ngOnInit() {
    const sortTrips = (a, b) =>  moment(a.date).isBefore(b.date) ? -1 : 1;
    const sortExpiredTrips = (a, b) => moment(a.date).isBefore(b.date) ? 1 : -1;
    const isExpired = (trip) => moment(trip.date).isBefore();
    this.uiService.onLoading().subscribe(state => this.setLocalLoading(state));
    this.uiService.setLoading(true);
    this.userService.getCurrentUser()
    .subscribe(user => {
      if (user) {
        this.postService.getTripByAuthor(user.id)
        .subscribe(trips => {
          if (trips) {
            this.trips = trips.map(trip => new Trip(trip)).filter(trip => !isExpired(trip)).sort(sortTrips);
            this.expiredTrips = trips.map(trip => new Trip(trip)).filter(trip => isExpired(trip)).sort(sortExpiredTrips);
            this.uiService.setLoading(false);
          }
        });
      }
      this.uiService.setLoading(false);
    }, (error) => this.uiService.serverError(error));
    this.manageDrafts();
  }

  newTrip() {
    this.router.navigate(['/post/trip/new']);
  }

  remove(index: number) {
    this.trips.splice(index, 1);
  }

  deleteDraft() {
    this.postService.deleteTripDraft();
    this.hasDraft = false;
  }

  private manageDrafts() {
    const draft = this.postService.getTripDraft();
    this.hasDraft = !!draft;
  }

  private setLocalLoading(state: boolean) {
    this.loading = state;
    this.trips = state ? [new Trip({}), new Trip({}), new Trip({})] : [];
  }

}
