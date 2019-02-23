import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PostService } from '@core/post.service';

import { Trip } from '@models/post/trip.model';
import { DateAdapter, MatSnackBar } from '@angular/material';
import { UserService } from '@core/user.service';
import { Request } from '@models/post/request.model';

@Component({
  selector: 'app-trip-detail',
  templateUrl: './trip-detail.component.html',
  styleUrls: ['./trip-detail.component.scss']
})
export class TripDetailComponent implements OnInit {
  trip: Trip = null;
  requests: Array<Request> = null;
  currentRequest: Request = null;
  engagement = false;
  own = false;

  constructor(
    private router: Router,
    private dateAdapter: DateAdapter<Date>,
    private route: ActivatedRoute,
    private userService: UserService,
    private postService: PostService,
    private snack: MatSnackBar,
  ) { }

  ngOnInit() {
    this.dateAdapter.setLocale('fr');
    this.route.params.subscribe(param => {
      if (param && param.id) {
        this.postService.getTripById(param.id)
        .subscribe(trip => {
          if (trip) {
            this.trip = new Trip(trip);
            const requestDraft = this.postService.getRequestDraft();
            if (requestDraft && requestDraft.trip.id === this.trip.id) {
              this.engagement = true;
            }
            this.userService.getCurrentUser()
            .subscribe(user => {
              this.own = user.id === trip.user.id;
            });
            this.getUserRequests();
          }
        });
      }
    });
  }

  getUserRequests() {
    this.userService.getCurrentUser()
    .subscribe(user => {
      this.postService.getRequestByTrip(user.id, this.trip.id)
      .subscribe((requests) => {
        if (requests) {
          this.requests = requests.map(request => new Request(request));
          this.currentRequest = this.requests.find(request => !request.closed && !request.validated);
        }
      });
    });
  }

  openRequest() {
    this.router.navigate([`/post/request/${this.currentRequest.id}`]);
  }

  closeRequest() {
    this.postService.closeRequest(this.currentRequest.id)
    .subscribe((response) => {
      if (response.status) {
        const request = new Request(response.data);
        if (request.id === this.currentRequest.id && request.closed) {
          this.snack.open('La demande a été annulée', 'OK', {duration: 3000});
          this.currentRequest = null;
        }
      }
    });
  }

}
