import { Component, OnInit, EventEmitter, Input, Output, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import { Post } from '@models/post/post.model';

import { PostService } from '@core/post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, AfterViewInit {
  posts: Array<Post> = [];
  carousel: any;
  @Output() listRefresh = new EventEmitter();
  @Input() trip = true;
  @Input() horizontal = false;

  constructor(private postService: PostService) { }

  ngOnInit() {
    if (this.trip) {
      this.postService.onTrips()
      .subscribe(trips => {
        if (trips) {
          this.setPosts(trips);
        }
      });
      if (!this.posts.length) {
        this.postService.getTrips();
      }
    } else {
      this.postService.onRequests()
      .subscribe(requests => {
        if (requests) {
          this.setPosts(requests);
        }
      });
      if (!this.posts.length) {
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
    this.posts = posts;
    this.listRefresh.emit(posts.length);
  }

}
