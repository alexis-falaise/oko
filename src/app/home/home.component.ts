import { Component, OnInit, HostListener, ChangeDetectorRef, ElementRef, Inject, AfterViewInit } from '@angular/core';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DOCUMENT } from '@angular/platform-browser';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSnackBar, MatDialog } from '@angular/material';
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
import { UserService } from '@core/user.service';
import { InstallComponent } from '@core/dialogs/install/install.component';
import { User } from '@models/user.model';

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

  private locationSamples = ['Paris', 'Santa Cruz', 'Dakar', 'Bògota',
  'Lille', 'Shenzen', 'Madrid', 'Sacramento', 'Zagreb', 'Abidjan',
  'Lome', 'Rome', 'New York', 'Montréal', 'Tokyo', 'Manille', 'Phnom Penh', 'Riyad'];
  private itemSamples = ['un parfum', 'une liseuse', 'un iPhone', 'un camembert', 'des chaussures',
  'du vin', 'une guitare', 'une montre', 'des baskets', 'un livre', 'de la charcuterie',
  'une chemise'];
  public prod = environment.production;
  backgroundImage = 'assets/hero.jpg';
  swingingLocation = this.locationSamples[0];
  swingingItem = this.itemSamples[0];
  displayTagline: string;
  taglines = [
    'Le service de livraison collaboratif',
    'Ça veut dire transport',
  ];
  taglineEnter = false;
  taglineExit = false;
  posts: Array<Post> = null;
  filter = new Filter({});
  displayContent = false;
  onBoarding = false;
  expanded = true;
  empty = false;
  validated = false;
  profileSnack = false;
  today = moment();
  city: City | string;
  cities: Array<City> = [];
  deferredPrompt = null;
  standaloneMode = false;
  currentUser: User;

  constructor(
    @Inject(DOCUMENT) public document: Document,
    private authService: AuthService,
    private postService: PostService,
    private uiService: UiService,
    private userService: UserService,
    private geoService: GeoService,
    private homeElement: ElementRef,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private router: Router,
  ) { }

  onScroll(event) {
      const children = this.homeElement.nativeElement.children[0].children;
      const heightUnit = children[0].clientHeight / 40;
      const content = children[1];
      const onboarding = content.children[1];
      const scrollTop = event.target.scrollTop;
      this.displayContent = scrollTop > (content.offsetTop - 20 * heightUnit);
      this.onBoarding = scrollTop > (onboarding.offsetTop - 25 * heightUnit);
  }

  ngOnInit() {
    this.uiService.setLoading(true);
    this.geoService.onCities().subscribe(cities => {
      this.uiService.setLoading(false);
      this.cities = cities;
    });
    this.authService.onUser().subscribe(authUser => {
      if (authUser) {
        this.userService.getCurrentUser().subscribe(user => {
          this.currentUser = user;
          if ((user.sessions && user.sessions.length === 1 || !user.sessions) && !this.profileSnack) {
            this.profileSnack = true;
            const snack = this.snack.open('Complétez votre profil !', 'Bonne idée', {duration: 7500});
            snack.onAction().subscribe(() => this.router.navigate(['/account/info']));
          }
        });
      }
    });
    this.init();
    this.manageDrafts();
    this.promptInstall();
  }

  init() {
    timer(0, 1500).subscribe(() => this.swingDisplay());
    this.displayTagline = this.taglines[0];
    timer(3000, 4000).subscribe(() => this.swapTagline());
    this.uiService.setLoading(false);
    this.geoService.getCities();
    this.filter = new Filter({});
    this.postService.resetTripFilters();
    this.postService.getTrips();
    this.standaloneMode = window.matchMedia('(display-mode: standalone)').matches;
  }

  edit() {
    this.expanded = true;
    this.displayContent = false;
    this.validated = false;
    const hero = this.document.getElementById('hero');
    hero.scrollIntoView({behavior: 'smooth'});
  }

  validate() {
    if (this.filter.location && this.filter.location !== '') {
      const element = this.document.getElementById('trip-list');
      element.scrollIntoView({behavior: 'smooth', block: 'center'});
    }
    if (this.empty) {
      this.post();
    }
  }

  filterPosts() {
    this.uiService.setLoading(true);
    const searchValue = typeof this.city === 'string' ? this.city : this.city.city;
    const filter = new Filter();
    if (searchValue && searchValue !== '') {
      filter.location = searchValue;
    }
    if (this.filter.item) {
      filter.item = this.filter.item;
    }
    this.filter = filter;
    this.postService.getTrips(this.filter);
    this.geoService.getCities(searchValue);
  }

  resetCity() {
    this.city = '';
    this.filterPosts();
  }

  resetItem() {
    this.filter.item = null;
    this.filterPosts();
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

  install() {
    this.dialog.open(InstallComponent, {
      height: '80vh',
      width: '80vw',
    });
  }

  post() {
    this.uiService.setLoading(true);
    if (this.empty && this.city) {
      const isCompleteCity = typeof this.city !== 'string';
      const requestDraft = new Request({
        meetingPoint: {
          city: isCompleteCity ? this.city['city'] : this.city,
          country: isCompleteCity ? this.city['country'] : undefined
        }
      });
      if (this.filter.item) {
        requestDraft.items = [{label: this.filter.item}];
      }
      this.postService.saveRequestDraft(requestDraft);
    }
    this.router.navigate(['/post/request/new']);
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
    this.swingingLocation = this.swing(this.locationSamples, this.swingingLocation);
  }

  private swingItem() {
    this.swingingItem = this.swing(this.itemSamples, this.swingingItem);
  }

  private swing(array: Array<string>, item: string): string {
    const index = array.findIndex(sample => sample === item);
    const nextIndex = (index + 1 < array.length)
    ? index + 1 : 0;
    return array[nextIndex];
  }

  private swapTagline() {
    this.taglineExit = true;
    timer(250).subscribe(() => {
      const currentTaglineIndex = this.taglines.findIndex(line => line === this.displayTagline);
      const nextTaglineIndex = currentTaglineIndex + 1 < this.taglines.length
      ? currentTaglineIndex + 1 : 0;
      const nextTagline = this.taglines[nextTaglineIndex];
      this.displayTagline = nextTagline;
      this.taglineEnter = true;
      this.taglineExit = false;
      timer(250).subscribe(() => this.taglineEnter = false);
    });
  }

  private promptInstall() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      const a2hsBtn: any = document.querySelector('.ad2hs-prompt');

      a2hsBtn.style.display = 'block';

      a2hsBtn.addEventListener('click', () => {
        a2hsBtn.style.display = 'none';
        this.deferredPrompt.prompt();
        this.deferredPrompt.userChoice
        .then(function(choiceResult) {

          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the A2HS prompt');
          } else {
            console.log('User dismissed the A2HS prompt');
          }

          this.deferredPrompt = null;
        });
      });
    });
  }
}
