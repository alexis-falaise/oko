import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, DateAdapter } from '@angular/material';

import { PostService } from '@core/post.service';

import { Request } from '@models/post/request.model';
import { Trip } from '@models/post/trip.model';

@Component({
  selector: 'app-request-detail',
  templateUrl: './request-detail.component.html',
  styleUrls: ['./request-detail.component.scss']
})
export class RequestDetailComponent implements OnInit {
  request: Request = new Request();
  loading: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private snack: MatSnackBar,
    private dateAdapter: DateAdapter<any>
  ) { }

  ngOnInit() {
    this.dateAdapter.setLocale('fr');
    this.loading = true;
    this.route.params.subscribe(param => {
      if (param && param.id) {
        this.postService.getRequestById(param.id)
        .subscribe((request) => {
          if (request) {
            const currentRequest = new Request(request);
            currentRequest.trip = new Trip(currentRequest.trip);
            this.request = currentRequest;
            this.loading = false;
            console.log(request);
          }
        });
      }
    });
  }

  validate() {
    this.loading = true;
    this.postService.validateRequest(this.request.id)
    .subscribe((response) => {
      if (response.status) {
        this.snack.open('La demande a été validée', 'OK', {duration: 3000});
        this.request = new Request(response.data);
        this.loading = false;
      }
    });
  }

  cancel() {
    this.loading = true;
    this.postService.closeRequest(this.request.id)
    .subscribe((response) => {
      if (response.status) {
        this.snack.open('La demande a été annulée', 'OK', {duration: 3000});
        this.request = new Request(response.data);
        console.log(response.data);
        this.loading = false;
      }
    });
  }

  openTrip() {
    this.router.navigate([`/post/trip/${this.request.trip.id}`]);
  }

}
