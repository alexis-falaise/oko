import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, DateAdapter } from '@angular/material';

import { PostService } from '@core/post.service';

import { Request } from '@models/post/request.model';
import { Trip } from '@models/post/trip.model';
import { UiService } from '@core/ui.service';
import { UserService } from '@core/user.service';

@Component({
  selector: 'app-request-detail',
  templateUrl: './request-detail.component.html',
  styleUrls: ['./request-detail.component.scss']
})
export class RequestDetailComponent implements OnInit {
  request: Request = new Request();
  own = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private postService: PostService,
    private uiService: UiService,
    private snack: MatSnackBar,
    private dateAdapter: DateAdapter<any>
  ) { }

  ngOnInit() {
    this.dateAdapter.setLocale('fr');
    this.uiService.setLoading(true);
    this.route.params.subscribe(param => {
      if (param && param.id) {
        this.postService.getRequestById(param.id)
        .subscribe((request) => {
          if (request) {
            this.userService.getCurrentUser()
            .subscribe(user => {
              if (user) {
                this.own = user.id === request.user.id;
              }
              this.setRequest(request);
            }, (err) => this.setRequest(request));
          }
        });
      }
    });
  }

  setRequest(request: Request) {
    if (request.trip) {
      request.trip = new Trip(request.trip);
    }
    this.request = new Request(request);
    this.uiService.setLoading(false);
  }

  validate() {
    this.uiService.setLoading(true);
    this.postService.validateRequest(this.request.id)
    .subscribe((response) => {
      if (response.status) {
        this.snack.open('La demande a été validée', 'OK', {duration: 3000});
        this.request = new Request(response.data);
        this.uiService.setLoading(false);
      }
    });
  }

  cancel() {
    this.uiService.setLoading(true);
    this.postService.closeRequest(this.request.id)
    .subscribe((response) => {
      if (response.status) {
        this.snack.open('La demande a été annulée', 'OK', {duration: 3000});
        this.request = new Request(response.data);
        this.uiService.setLoading(false);
      }
    });
  }

  openTrip() {
    this.router.navigate([`/post/trip/${this.request.trip.id}`]);
  }

}
