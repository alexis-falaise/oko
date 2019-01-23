import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { timer } from 'rxjs';

import { Post } from '@models/post/post.model';

import { AuthService } from '@core/auth.service';
import { PostService } from '@core/post.service';
import { Filter } from '@models/app/filter.model';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private locationSamples = ['Paris', 'Santa Cruz', 'Dakar', 'Bògota'];
  private itemSamples = ['un parfum', 'une liseuse', 'un iPhone'];
  backgroundImage = 'assets/hero.jpg';
  swingingLocation = this.locationSamples[0];
  swingingItem = this.itemSamples[0];
  posts: Array<Post>;
  filter = new Filter({});
  expanded = true;
  empty = false;
  validated = false;

  constructor(
    private authService: AuthService,
    private postService: PostService,
    private router: Router,
  ) { }

  ngOnInit() {
    timer(0, 1500).subscribe(() => this.swingDisplay());
    this.postService.resetPosts();
  }

  enter() {
    this.expanded = true;
    this.validated = false;
  }

  leave() {
    if (this.validated) {
      this.expanded = false;
    }
  }

  validate() {
    if (this.filter.location && this.filter.location !== '') {
      this.validated = true;
      this.expanded = false;
    }
    this.post();
  }

  filterPosts(userAction) {
    if (this.filter.location && this.filter.location.length > 2) {
      this.postService.filterPosts(this.filter);
    }
    if (this.filter.location === '' || userAction.key === 'backspace') {
      this.postService.resetPosts();
    }
  }

  onScroll(event) {
    this.expanded = false;
    this.post();
  }

  listStatus(length) {
    this.empty = length === 0;
  }

  post() {
    if (this.empty && !this.expanded || this.validated) {
      this.postService.draftPost(this.filter);
      this.router.navigate(['/post/request']);
    }
  }

  private swingDisplay() {
    this.swingLocation();
    this.swingItem();
  }

  private swingLocation() {
    const currentLocationIndex = this.locationSamples.findIndex(sample => sample === this.swingingLocation);
    const nextLocationIndex = (currentLocationIndex + 1 < this.locationSamples.length)
    ? currentLocationIndex + 1 : 0;
    this.swingingLocation = this.locationSamples[nextLocationIndex];

  }

  private swingItem() {
    const currentItemIndex = this.itemSamples.findIndex(sample => sample === this.swingingItem);
    const nextItemIndex = (currentItemIndex + 1 < this.itemSamples.length)
    ? currentItemIndex + 1 : 0;
    this.swingingItem = this.itemSamples[nextItemIndex];
  }
}
