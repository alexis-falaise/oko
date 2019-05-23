import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, timer } from 'rxjs';

import { PostService } from '@core/post.service';

import { Filter } from '@models/app/filter.model';
import { PexelsService } from '@core/pexels.service';
import { takeUntil } from 'rxjs/operators';
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
  background: string;
  hasBackground: boolean;
  nextSearch = new Subject();
  ngUnsubscribe = new Subject();

  constructor(
    private pexels: PexelsService,
    private postService: PostService,
  ) { }

  ngOnInit() {
    this.init();
  }

  init() {
    this.filter = this.postService.getTripFilters();
    this.postService.getTrips();
  }

  filterPosts(filter: Filter) {
    this.postService.getTrips(filter);
    this.nextSearch.next();
    timer(500)
    .pipe(takeUntil(this.nextSearch))
    .subscribe(() => {
      this.fetchBackground(filter.location);
    });
  }

  fetchBackground(location: string) {
    this.pexels.getBackgroundPicture(location, 'landscape')
    .subscribe((picture: string) => {
      if (picture) {
        this.background = picture;
        this.hasBackground = true;
      }
    });
  }

  toggleFilterDisplay() {
    this.displayFilter = !this.displayFilter;
    if (!this.displayFilter) {
      this.resetFilters();
      this.resetBackground();
    }
  }

  resetBackground() {
    this.background = null;
    this.hasBackground = false;
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
