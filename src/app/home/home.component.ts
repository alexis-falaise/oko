import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { timer } from 'rxjs';

import { environment } from '@env/environment';
import { AuthService } from '@core/auth.service';
import { PostService } from '@core/post.service';
import { UiService } from '@core/ui.service';

import { Post } from '@models/post/post.model';
import { Filter } from '@models/app/filter.model';
import { Request } from '@models/post/request.model';
import { GeoService } from '@core/geo.service';

class City {
  city: string;
  country: string;
  constructor(city: Partial<City>) {
    Object.assign(this, city);
  }
}
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

  private locationSamples = ['Paris', 'Santa Cruz', 'Dakar', 'Bògota', 'Lille', 'Shenzen', 'Madrid', 'Sacramento'];
  private itemSamples = ['un parfum', 'une liseuse', 'un iPhone', 'un camembert', 'des chaussures', 'du vin', 'une guitare'];
  public prod = environment.production;
  backgroundImage = 'assets/hero.jpg';
  swingingLocation = this.locationSamples[0];
  swingingItem = this.itemSamples[0];
  posts: Array<Post> = null;
  filter = new Filter({});
  expanded = true;
  empty = false;
  validated = false;
  today = moment();
  city: City | string;
  cities: Array<City> = [];

  constructor(
    private postService: PostService,
    private uiService: UiService,
    private geoService: GeoService,
    private snack: MatSnackBar,
    private router: Router,
  ) { }

  ngOnInit() {
    this.geoService.onCities().subscribe(cities => {
      this.uiService.setLoading(false);
      this.cities = cities;
    });
    this.init();
    this.manageDrafts();
  }

  init() {
    timer(0, 1500).subscribe(() => this.swingDisplay());
    this.uiService.setLoading(false);
    this.geoService.getCities();
    this.filter = new Filter({});
    this.postService.resetTripFilters();
    this.postService.getTrips();
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
    if (this.empty) {
      this.post();
    }
  }

  filterPosts() {
    this.uiService.setLoading(true);
    const searchValue = typeof this.city === 'string' ? this.city : this.city.city;
    this.filter = new Filter({location: searchValue, item: this.filter.item});
    this.postService.getTrips(this.filter);
    this.geoService.getCities(searchValue);
  }

  onScroll(event) {
    this.expanded = false;
  }

  listStatus(length) {
    if (!length && !this.empty) {
      this.snack.open('Aucun trajet correspondant', undefined, {duration: 2500});
    }
    this.empty = length === 0;
  }

  displayCity(city: City) {
    return city ? city.city : '';
  }

  post() {
    this.uiService.setLoading(true);
    if (this.empty && this.city) {
      const isCity = typeof this.city !== 'string';
      const requestDraft = new Request({
        meetingPoint: {
          city: isCity ? this.city['city'] : undefined,
          country: isCity ? this.city['country'] : undefined
        }
      });
      if (this.filter.item) {
        requestDraft.items = [{label: this.filter.item}];
      }
      this.postService.saveRequestDraft(requestDraft);
    }
    this.router.navigate(['/post/request/new']);
  }

  deleteEverything() {
    this.postService.deleteAllPosts();
  }

  private manageDrafts() {
    const tripDraft = this.postService.getTripDraft();
    const requestDraft = this.postService.getRequestDraft();
    if (tripDraft || requestDraft) {
      const snackMessage = 'Brouillon de ' + (tripDraft ? 'trajet' : 'demande');
      const snackRef = this.snack.open(snackMessage, 'Ouvrir', {duration: 5000});
      let route;
      if (tripDraft) {
        route = '/post/trip/new';
      } else {
        if (requestDraft) {
          route  = requestDraft.trip ? ('/post/trip/' + requestDraft.trip.id ) : '/post/request/new';
        } else {
          route = '/home';
        }
      }
      snackRef.onAction().subscribe(() => this.router.navigate([route]));
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
