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
    to: null,
    constraints: null,
  };
  constraintsInfo = null;
  loading = false;
  edition = false;
  trip: Trip = null;

  constructor(
    private postService: PostService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    public snack: MatSnackBar
  ) { }

  ngOnInit() {
    this.route.url.subscribe(segments => {
      const editionSegment = segments.find(segment => segment.path === 'edit');
      this.loading = true;
      if (editionSegment) {
        this.edition = true;
        this.route.params.subscribe(param => {
          const id = param.id;
          this.postService.getTripById(id)
          .subscribe(trip => {
            trip = new Trip(trip);
            this.trip = trip;
            console.log(trip);
            console.log(trip.date.format('DD/MM/YYYY'));
            this.departureInfo = {
              city: trip.from.label,
              airport: new Airport(trip.from.airport),
              date: moment(),
              time: `${moment().hours()}:${moment().minutes()}`
            };
            this.arrivalInfo = {
              city: trip.to.label,
              airport: new Airport(trip.to.airport),
              date: trip.date,
              time: trip.date.format('HH:mm'),
            };
            this.constraintsInfo = {
              luggages: trip.luggages.map(luggage => new Luggage(luggage)),
              airportDrop: trip.airportDrop,
              bonus: trip.bonus
            };
            this.loading = false;
          });
        });
      } else {
        this.loading = false;
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

  departure(info) {
    if (!(info.airport instanceof Airport)) {
      info.aiport = new Airport({label: info.airport});
    }
    this.departureInfo = info;
  }

  arrival(info) {
    this.arrivalInfo = info;
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

  returnConstraints(info) {
    this.returnInfo.constraints = info;
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

  removeTrip() {
    this.postService.removeTrip(this.trip)
    .subscribe((serverResponse) => {
      if (serverResponse.status) {
        this.snack.open('Le trajet a bien été supprimé', 'OK', {duration: 3000});
        this.router.navigate(['/account/trip']);
      } else {
        const snackRef = this.snack.open('Erreur lors de la suppression du trajet', 'Réessayer', {duration: 3000});
        snackRef.onAction().subscribe(() => this.removeTrip());
      }
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
    const constraints = this.constraintsInfo;
    const luggages = this.constraintsInfo.luggages;
    const bonus = this.constraintsInfo.bonus;
    delete constraints.luggages;
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
      luggages: luggages,
      bonus: bonus,
      date: moment(this.arrivalInfo.date).hours(arrivalTime.hours()).minutes(arrivalTime.minutes()),
      ...constraints
    });
    tripBatch.push(trip);
    // const returnConstraints = this.returnInfo.constraints;
    // const returnLuggages = this.returnInfo.constraints.luggages;
    // delete returnConstraints.luggages;
    // if (this.return && this.returnInfo.from && this.returnInfo.to) {
    //   const returnTime = moment(this.returnInfo.to.time);
    //   const returnTrip = new Trip({
    //     user: user,
    //     from : {
    //       label: this.returnInfo.from.city,
    //       airport: this.returnInfo.from.airport
    //     },
    //     to: {
    //       label: this.returnInfo.to.city,
    //       airport: this.returnInfo.to.airport
    //     },
    //     luggages: returnLuggages,
    //     date: moment(this.returnInfo.to.date).hours(returnTime.hours()).minutes(returnTime.minutes()),
    //     ...returnConstraints
    //   });
    //   tripBatch.push(returnTrip);
    // }
    return tripBatch;
  }

}
