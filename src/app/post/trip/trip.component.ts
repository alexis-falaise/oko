import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatDialog, MatSnackBar, MatStepper } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

import { PostService } from '@core/post.service';
import { UserService } from '@core/user.service';
import { UiService } from '@core/ui.service';

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
export class TripComponent implements OnInit, OnDestroy {

  fromExtended = true;
  fromFocus = false;
  locationEven = false;
  return = false;
  departureSave = null;
  departureInfo = null;
  arrivalSave = null;
  arrivalInfo = null;
  constraintsSave = null;
  constraintsInfo = null;
  loading = false;
  edition = false;
  saved = false;
  trip: Trip = null;

  constructor(
    private postService: PostService,
    private userService: UserService,
    private uiService: UiService,
    private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
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
            const formattedTrip = new Trip(trip);
            this.trip = formattedTrip;
            this.setDataFromTrip(formattedTrip);
            this.loading = false;
            this.ref.detectChanges();
          });
        });
      } else {
        this.loading = false;
      }
    });
    this.manageDrafts();
  }

  departure(info, stepper: MatStepper) {
    if (info) {
      if (!(info.airport instanceof Airport)) {
        info.airport = new Airport(info.airport);
      }
      this.departureSave = info;
      stepper.next();
    }
  }

  arrival(info, stepper: MatStepper) {
    if (info) {
      this.arrivalSave = info;
      stepper.next();
    }
  }

  constraints(info) {
    if (info) {
      this.constraintsSave = info;
    }
  }

  save() {
    this.loading = true;
    this.userService.getCurrentUser()
    .subscribe(
      (user) => {
        if (user) {
          const trip = this.generateTrip(user);
          if (!this.edition) {
            this.postService.createTrip(trip)
            .subscribe(response => {
            this.loading = false;
              if (response.status) {
                this.saved = true;
                this.postService.deleteTripDraft();
                this.snack.open('Voyage enregistré', 'Top!', {duration: 2000});
                this.router.navigate(['/home']);
              }
            });
          } else {
            this.postService.updateTrip(trip)
            .subscribe(response => {
              this.loading = false;
              if (response.status) {
                this.saved = true;
                this.snack.open('Voyage modifié', 'OK', {duration: 2500});
                this.router.navigate(['/account/trip']);
              }
            });
          }
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

  ngOnDestroy() {
    if (!this.saved) {
      this.saveDraft();
    }
  }

  private saveError() {
    this.saveDraft();
    this.openDialog();
  }

  private saveDraft() {
    if (this.departureSave || this.arrivalSave || this.constraintsSave) {
      this.postService.saveTripDraft({
        departure: this.departureSave,
        arrival: this.arrivalSave,
        constraints: this.constraintsSave,
        edition: this.edition,
        trip: this.trip || null,
      });
    }
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
    const trip = this.generateTrip(user);
    tripBatch.push(trip);
    return tripBatch;
  }

  private generateTrip(user: User) {
    const departureTime = moment(this.departureSave.time, 'HH:mm');
    const arrivalTime = moment(this.arrivalSave.time, 'HH:mm');
    const constraints = this.constraintsSave;
    const luggages = constraints.luggages;
    const bonus = constraints.bonus;
    delete constraints.luggages;
    const trip = new Trip({
      user: user,
      from : {
        label: this.departureSave.city,
        airport: this.departureSave.airport
      },
      to : {
        label: this.arrivalSave.city,
        airport: this.arrivalSave.airport
      },
      luggages: luggages,
      bonus: bonus,
      departureDate: moment(this.departureSave.date).hours(departureTime.hours()).minutes(departureTime.minutes()),
      date: moment(this.arrivalSave.date).hours(arrivalTime.hours()).minutes(arrivalTime.minutes()),
      ...constraints
    });
    if (this.edition) {
      trip.id = this.trip.id;
    }
    return trip;
  }

  private setDataFromTrip(trip: Trip) {
    this.departureInfo = {
      city: trip.from.label,
      airport: new Airport(trip.from.airport),
      date: trip.departureDate || moment(),
      time: trip.departureDate ? trip.departureDate.format('HH:mm') : `${moment().hours()}:${moment().minutes()}`,
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
    this.constraintsSave = this.constraintsInfo;
    if (this.edition) {
      this.departureSave = this.departureInfo;
      this.arrivalSave = this.arrivalInfo;
    }
  }

  private manageDrafts() {
    const draft = this.postService.getTripDraft();
    if (draft) {
      this.departureInfo = draft.departure;
      this.departureSave = draft.departure;
      this.arrivalInfo = draft.arrival;
      this.arrivalSave = draft.arrival;
      this.constraintsInfo = draft.constraints;
      this.constraintsSave = draft.constraints;
      this.edition = draft.edition;
      this.trip = draft.trip;
      if (this.edition) {
        this.router.navigate(['post', 'trip', draft.trip.id, 'edit']);
      }
    }
  }

}
