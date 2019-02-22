import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PostService } from '@core/post.service';
import { Filter } from '@models/app/filter.model';
import { UiService } from '@core/ui.service';

@Component({
  selector: 'app-trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.scss']
})
export class TripListComponent implements OnInit {
  empty = false;
  filter = new Filter();
  loading = false;

  constructor(
    private postService: PostService,
    private uiService: UiService,
    private ref: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.init();
    this.uiService.onLoading()
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

  listStatus(listLength: number) {
    this.empty = listLength === 0;
  }

}
