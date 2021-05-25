import { Component, OnInit } from '@angular/core';

import { User } from '@models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PexelsService } from '@core/pexels.service';
import { forkJoin, Observable } from 'rxjs';
import { UserService } from '@core/user.service';
import { MessengerService } from '@core/messenger.service';
import { MatSnackBar } from '@angular/material/snack-bar';

class DisplayElement {
  label: string;
  picture?: string;
}

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss']
})
export class ProfileDetailsComponent implements OnInit {
  user: User;
  currentUser: User;
  own: boolean;
  livedCountries: Array<DisplayElement>;
  visitedCountries: Array<DisplayElement>;
  interests: Array<DisplayElement>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snack: MatSnackBar,
    private messengerService: MessengerService,
    private userService: UserService,
    private pexelService: PexelsService
  ) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      if (data.user) {
        this.user = data.user;
        this.init();
      }
    });
    this.userService.getCurrentUser(false)
    .subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.own = this.currentUser.id === this.user.id;
      } else {
        this.own = false;
      }
    });
  }

  init() {
    if (this.user.description) {
      this.livedCountries = this.user.description.livedCountries.map(country => ({label: country}));
      this.visitedCountries = this.user.description.visitedCountries.map(country => ({label: country}));
      this.interests = this.user.description.interests.map(interest => ({label: interest}));
      this.fetchDisplayElementList(this.user.description.interests)
      .subscribe(interests => this.interests = interests);
      this.fetchDisplayElementList(this.user.description.livedCountries)
      .subscribe(countries => this.livedCountries = countries);
      this.fetchDisplayElementList(this.user.description.visitedCountries)
      .subscribe(countries => this.visitedCountries = countries);

    }
  }

  userRoute() {
    this.router.navigate(['/profile', this.user.id, 'route']);
  }

  contact() {
    this.messengerService.getContactThread(this.user, this.currentUser);
  }

  private fetchDisplayElementList(countries: Array<string>): Observable<Array<DisplayElement>> {
    return Observable.create(observer => {
      if (countries) {
        forkJoin(countries.map((country, index) => {
          return this.pexelService.getBackgroundPicture(country, 'medium');
        })).subscribe(pictures => {
          let output;
          if (pictures) {
            output = countries.map((country, index) => {
              return {
                label: country,
                picture: pictures[index]
              };
            });
          } else {
            output = countries.map(country => ({label: country}));
          }
          observer.next(output);
          observer.complete();
        });
      } else {
        observer.next(null);
      }
    });
  }

}
