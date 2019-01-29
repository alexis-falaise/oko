import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

import { Post } from '@models/post/post.model';

import { PostService } from '@core/post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {
  posts: Array<Post> = [];
  @Output() listRefresh = new EventEmitter();
  @Input() trip = true;
  @Input() horizontal = false;

  constructor(private postService: PostService) { }

  ngOnInit() {
    if (this.trip) {
      this.postService.onTrips()
      .subscribe(trips => {
        if (trips) {
          this.posts = trips;
          this.listRefresh.emit(trips.length);
        }
      });
      this.postService.getTrips();
    } else {
      this.postService.onRequests()
      .subscribe(requests => {
        if (requests) {
          this.posts = requests;
          this.listRefresh.emit(requests.length);
        }
      });
      this.postService.getRequests();
    }
  }

}
