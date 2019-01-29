import { Component, OnInit } from '@angular/core';
import { PostService } from '@core/post.service';

@Component({
  selector: 'app-trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.scss']
})
export class TripListComponent implements OnInit {
  empty = false;

  constructor(
    private postService: PostService
  ) { }

  ngOnInit() {
  }

  filterPosts(filter) {
    this.postService.getTrips(filter);
  }

  listStatus(listLength: number) {
    this.empty = listLength === 0;
  }

}
