import { Component, OnInit, EventEmitter, Input, Output, AfterViewInit } from '@angular/core';

import { Post } from '@models/post/post.model';
import { Trip } from '@models/post/trip.model';

import { PostService } from '@core/post.service';
import { UiService } from '@core/ui.service';
import { Request } from '@models/post/request.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, AfterViewInit {
  posts: Array<Post> = [new Trip({}), new Trip({}), new Trip({})];
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
    this.uiService.setMainLoading(true);
    if (this.trip) {
      this.postService.onTrips()
      .subscribe(trips => {
        if (trips) {
          this.setPosts(trips);
          this.uiService.setLoading(false);
          this.uiService.setMainLoading(false);
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
          this.uiService.setMainLoading(false);
        }
      });
      if (!this.posts) {
        this.postService.getRequests();
      }
    }
    this.uiService.onLoading().subscribe(loading => this.loadingDisplay(loading));
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

  loadingDisplay(loading: boolean) {
    if (loading) {
      this.posts = this.generatePlaceholder(5);
    }
  }

  generatePlaceholder(items: number): Array<Post | Trip | Request> {
    const array = [];
    for (let i = 0; i < items; i++) {
      array.push(this.trip ? new Trip({}) : new Request({}));
    }
    return array;
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
