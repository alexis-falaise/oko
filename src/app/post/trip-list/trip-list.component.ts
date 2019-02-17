import { Component, OnInit } from '@angular/core';
import { PostService } from '@core/post.service';
import { Filter } from '@models/app/filter.model';

@Component({
  selector: 'app-trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.scss']
})
export class TripListComponent implements OnInit {
  empty = false;
  filter = new Filter();

  constructor(
    private postService: PostService
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

  resetFilters() {
    this.postService.resetTripFilters();
    this.init();
  }

  listStatus(listLength: number) {
    this.empty = listLength === 0;
  }

}
