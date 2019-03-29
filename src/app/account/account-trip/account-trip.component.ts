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
  sortTrips = (a, b) =>  moment(a.date).isBefore(b.date) ? -1 : 1;
  sortExpiredTrips = (a, b) => moment(a.date).isBefore(b.date) ? 1 : -1;
  isExpired = (trip) => moment(trip.date).isBefore();

  constructor(
    private postService: PostService,
    private userService: UserService,
    private uiService: UiService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.uiService.onLoading().subscribe(state => this.setLocalLoading(state));
    this.uiService.setLoading(true);
    this.fetchTrips();
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

  private fetchTrips() {
    this.userService.getCurrentUser()
    .subscribe(user => {
      if (user) {
        this.uiService.setLoading(true);
        this.postService.getTripByAuthor(user.id)
        .subscribe(trips => {
          this.uiService.setLoading(false);
          if (trips) {
            this.trips = trips.map(trip => new Trip(trip)).filter(trip => !this.isExpired(trip)).sort(this.sortTrips);
            this.expiredTrips = trips.map(trip => new Trip(trip)).filter(trip => this.isExpired(trip)).sort(this.sortExpiredTrips);
          }
        }, (error) => {
          this.uiService.setLoading(false);
          this.uiService.serverError(error);
        });
      } else {
        this.uiService.setLoading(false);
      }
    }, (error) => this.uiService.serverError(error));
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
