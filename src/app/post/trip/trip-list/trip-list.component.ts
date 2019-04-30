import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

import { PostService } from '@core/post.service';

import { Filter } from '@models/app/filter.model';
@Component({
  selector: 'app-trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: ['../../post-list.scss']
})
export class TripListComponent implements OnInit, OnDestroy {
  filter = new Filter();
  displayFilter = false;
  filterComponentOptions = {
    location: true,
    beforeDate: true
  };
  loading = false;
  ngUnsubscribe = new Subject();

  constructor(
    private postService: PostService,
  ) { }

  ngOnInit() {
    this.init();
  }

  init() {
    this.filter = this.postService.getTripFilters();
    this.postService.getTrips();
  }

  filterPosts(filter) {
    this.postService.getTrips(filter);
  }

  toggleFilterDisplay() {
    this.displayFilter = !this.displayFilter;
  }

  resetFilters() {
    this.postService.resetTripFilters();
    this.init();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
