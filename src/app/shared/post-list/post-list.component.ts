import { Component, OnInit, EventEmitter, Input, Output, AfterViewInit } from '@angular/core';

import { Post } from '@models/post/post.model';
import { Trip } from '@models/post/trip.model';

import { PostService } from '@core/post.service';
import { Request } from '@models/post/request.model';
import { Subject, timer } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, AfterViewInit {
  listLengthCache = 3;
  localLoading = new Subject<boolean>();
  posts: Array<Post> = [new Trip({}), new Trip({}), new Trip({})];
  carousel: any;
  empty = false;
  @Output() listRefresh = new EventEmitter();
  @Input() trip = false;
  @Input() horizontal = false;

  constructor(private postService: PostService) { }

  ngOnInit() {
    this.setLocalLoading(true);
    if (this.trip) {
      this.postService.onTrips()
      .subscribe(trips => {
        if (trips) {
          this.setPosts(trips);
          this.setLocalLoading(false);
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
          this.setLocalLoading(false);
        }
      });
      if (!this.posts) {
        this.postService.getRequests();
      }
    }
    this.onLocalLoading().subscribe(loading => this.loadingDisplay(loading));
  }

  ngAfterViewInit() {
    timer(250).subscribe(() => {
      this.carousel = $('#postListCarousel');
      this.carousel.carousel('pause');
    });
  }

  previous() {
    this.carousel.carousel('prev');
  }

  next() {
    this.carousel.carousel('next');
  }

  loadingDisplay(loading: boolean) {
    if (loading) {
      this.posts = this.generatePlaceholder(this.listLengthCache);
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
    this.listLengthCache = posts.length;
    this.listRefresh.emit(posts.length);
  }

  private onLocalLoading() {
    return this.localLoading.asObservable();
  }

  private setLocalLoading(state: boolean) {
    this.localLoading.next(state);
  }

}
