import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { PostService } from '@core/post.service';
import { UiService } from '@core/ui.service';

import { Filter } from '@models/app/filter.model';
@Component({
  selector: 'app-trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.scss']
})
export class TripListComponent implements OnInit, OnDestroy {
  filter = new Filter();
  loading = false;
  ngUnsubscribe = new Subject();

  constructor(
    private postService: PostService,
    private uiService: UiService,
    private ref: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.init();
    this.uiService.onLoading()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(loadingState => {
      this.loading = loadingState;
      this.ref.detectChanges();
    });
  }

  init() {
    this.filter = this.postService.getTripFilters();
    this.postService.getTrips();
  }

  filterPosts(filter) {
    this.uiService.setLoading(true);
    this.postService.getTrips(filter);
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
