import { Component, OnInit, HostListener } from '@angular/core';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { timer } from 'rxjs';

import { environment } from '@env/environment';
import { AuthService } from '@core/auth.service';
import { PostService } from '@core/post.service';

import { Post } from '@models/post/post.model';
import { Filter } from '@models/app/filter.model';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'fr-FR'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})
export class HomeComponent implements OnInit {

  private locationSamples = ['Paris', 'Santa Cruz', 'Dakar', 'Bògota'];
  private itemSamples = ['un parfum', 'une liseuse', 'un iPhone'];
  public prod = environment.production;
  backgroundImage = 'assets/hero.jpg';
  swingingLocation = this.locationSamples[0];
  swingingItem = this.itemSamples[0];
  today = moment();
  posts: Array<Post>;
  filter = new Filter({});
  expanded = true;
  empty = false;
  validated = false;

  constructor(
    private authService: AuthService,
    private postService: PostService,
    private adapter: DateAdapter<any>,
    private snack: MatSnackBar,
    private router: Router,
  ) { }

  ngOnInit() {
    timer(0, 1500).subscribe(() => this.swingDisplay());
    const draft = this.postService.getTripDraft();
    if (draft) {
      const snackRef = this.snack.open('Brouillon de trajet', 'Ouvrir', {duration: 5000});
      snackRef.onAction().subscribe(() => this.router.navigate(['/post/trip/new']));
    }
  }

  expand() {
    this.expanded = true;
  }

  shrink() {
    this.expanded = false;
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

  filterPosts(filter) {
    const filters = Object.assign(this.filter, filter);
    this.postService.getTrips(filters);
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

  deleteEverything() {
    this.postService.deleteAllPosts();
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
