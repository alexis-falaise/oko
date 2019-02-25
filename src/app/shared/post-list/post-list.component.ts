import { Component, OnInit, EventEmitter, Input, Output, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import { Post } from '@models/post/post.model';

import { PostService } from '@core/post.service';
import { UiService } from '@core/ui.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, AfterViewInit {
  posts: Array<Post> = [];
  carousel: any;
  empty = false;
  @Output() listRefresh = new EventEmitter();
  @Input() trip = false;
  @Input() horizontal = false;

  constructor(
    private postService: PostService,
    private uiService: UiService,
  ) { }

  ngOnInit() {
    this.uiService.setLoading(true);
    if (this.trip) {
      this.postService.onTrips()
      .subscribe(trips => {
        if (trips) {
          this.setPosts(trips);
          this.uiService.setLoading(false);
        }
      });
      if (!this.posts) {
        this.postService.getTrips();
      }
    } else {
      this.postService.onRequests()
      .subscribe(requests => {
        if (requests) {
          this.setPosts(requests);
          this.uiService.setLoading(false);
        }
      });
      if (!this.posts) {
        this.postService.getRequests();
      }
    }
  }

  ngAfterViewInit() {
    this.carousel = $('#postListCarousel');
    this.carousel.carousel('pause');
  }

  previous() {
    this.carousel.carousel('prev');
  }

  next() {
    this.carousel.carousel('next');
  }

  setPosts(posts) {
    if (!posts || posts && !posts.length) {
      this.empty = true;
    } else {
      this.empty = false;
    }
    this.posts = posts;
    this.listRefresh.emit(posts.length);
  }

}
