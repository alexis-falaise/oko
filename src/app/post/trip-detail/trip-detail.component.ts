import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PostService } from '@core/post.service';

import { Trip } from '@models/post/trip.model';

@Component({
  selector: 'app-trip-detail',
  templateUrl: './trip-detail.component.html',
  styleUrls: ['./trip-detail.component.scss']
})
export class TripDetailComponent implements OnInit {
  trip: Trip = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private postService: PostService,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(param => {
      if (param && param.id) {
        this.postService.getTripById(param.id)
        .subscribe(trip => {
          if (trip) {
            this.trip = new Trip(trip);
          }
        });
      }
    });
  }

}
