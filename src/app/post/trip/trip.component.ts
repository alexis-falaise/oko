import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { timer } from 'rxjs';
import * as moment from 'moment';

import { PostService } from '@core/post.service';
import { UserService } from '@core/user.service';

import { NotConnectedComponent } from '@core/dialogs/not-connected/not-connected.component';

import { Trip } from '@models/post/trip.model';
import { User } from '@models/user.model';
import { Airport } from '@models/airport.model';
import { Luggage } from '@models/luggage.model';
@Component({
  selector: 'app-trip',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.scss']
})
export class TripComponent implements OnInit {

  fromExtended = true;
  fromFocus = false;
  locationEven = false;
  return = false;
  departureInfo = null;
  arrivalInfo = null;
  returnInfo = {
    from: null,
    to: null
  };
  luggages: Array<Luggage> = [new Luggage()];
  constraintsInfo = null;
  loading = false;
  edition = false;

  constructor(
    private postService: PostService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    public snack: MatSnackBar
  ) { }

  ngOnInit() {
    this.route.params.subscribe(param => {
      console.log('Route param', param);
    });
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log('Router event', event);
      }
    });
    const draft = this.postService.getTripDraft();
    if (draft) {
      if (draft.return && (draft.return.from || draft.return.to)) {
        this.returnInfo = draft.return;
        this.return = true;
      }
      this.departureInfo = draft.departure;
      this.arrivalInfo = draft.arrival;
      this.constraintsInfo = draft.constraints;
    }
  }

  addLuggage() {
    this.luggages.push(new Luggage());
  }

  removeLuggage(index) {
    this.luggages.splice(index, 1);
  }

  departure(info) {
    if (!(info.airport instanceof Airport)) {
      info.aiport = new Airport({label: info.airport});
    }
    this.departureInfo = info;
    this.toArrival();
  }

  arrival(info) {
    this.arrivalInfo = info;
    this.toSummary();
  }

  returnFrom(info) {
    this.returnInfo.from = info;
  }

  returnTo(info) {
    this.returnInfo.to = info;
  }

  constraints(info) {
    this.constraintsInfo = info;
  }

  toDeparture() {
    this.fromExtended = true;
    this.locationEven = false;
  }

  toArrival() {
    this.fromExtended = false;
    this.locationEven = false;
  }

  toSummary() {
    this.fromExtended = false;
    this.locationEven = true;
  }

  sizing(value, luggageIndex) {
    this.luggages[luggageIndex] = new Luggage(value);
  }

  save() {
    this.loading = true;
    this.userService.getCurrentUser()
    .subscribe(
      (user) => {
        if (user) {
          const tripBatch = this.generateTripBatch(user);
          this.postService.createTrip(tripBatch)
          .subscribe(response => {
            this.loading = false;
            if (response.status) {
              this.postService.deleteTripDraft();
              this.snack.open('Voyage enregistré', 'Top!', {duration: 2000});
              this.router.navigate(['/home']);
            }
          });
        } else {
          this.saveError();
        }
      },
      (error) => {
        this.saveError();
      });
  }

  private saveError() {
    this.postService.saveTripDraft({
      departure: this.departureInfo,
      arrival: this.arrivalInfo,
      constraints: this.constraintsInfo,
      return: this.returnInfo
    });
    this.openDialog();
  }

  private openDialog() {
    const dialogRef = this.dialog.open(NotConnectedComponent, {
      width: '80vw',
      maxWidth: '500px',
      height: '50vh',
      maxHeight: '300px'
    });
    dialogRef.afterClosed().subscribe(() => {
      this.loading = false;
    });
  }

  private generateTripBatch(user: User) {
    const tripBatch = [];
    const arrivalTime = moment(this.arrivalInfo.time, 'HH:mm');
    const trip = new Trip({
      user: user,
      from : {
        label: this.departureInfo.city,
        airport: this.departureInfo.airport
      },
      to : {
        label: this.arrivalInfo.city,
        airport: this.arrivalInfo.airport
      },
      date: moment(this.arrivalInfo.date).hours(arrivalTime.hours()).minutes(arrivalTime.minutes()),
      ...this.constraintsInfo
    });
    tripBatch.push(trip);
    if (this.return && this.returnInfo.from && this.returnInfo.to) {
      const returnTime = moment(this.returnInfo.to.time);
      const returnTrip = new Trip({
        user: user,
        from : {
          label: this.returnInfo.from.city,
          airport: this.returnInfo.from.airport
        },
        to: {
          label: this.returnInfo.to.city,
          airport: this.returnInfo.to.airport
        },
        date: moment(this.returnInfo.to.date).hours(returnTime.hours()).minutes(returnTime.minutes()),
        ...this.constraintsInfo
      });
      tripBatch.push(returnTrip);
    }
    return tripBatch;
  }

}
