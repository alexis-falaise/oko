import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { timer } from 'rxjs';
import * as moment from 'moment';

import { PostService } from '@core/post.service';
import { UserService } from '@core/user.service';

import { NotConnectedComponent } from '@core/dialogs/not-connected/not-connected.component';

import { Trip } from '@models/post/trip.model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-trip',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.scss']
})
export class TripComponent implements OnInit {

  fromExtended = true;
  locationEven = false;
  return = false;
  departureInfo = null;
  arrivalInfo = null;
  returnInfo = {
    from: null,
    to: null
  };
  constraintsInfo = null;
  loading = false;

  constructor(
    private postService: PostService,
    private userService: UserService,
    private router: Router,
    public dialog: MatDialog,
    public snack: MatSnackBar
  ) { }

  ngOnInit() {
    const draft = this.postService.getTripDraft();
    if (draft) {
      if (draft.returnInfo && (draft.returnInfo.from || draft.returnInfo.to)) {
        this.returnInfo = draft.returnInfo;
        this.return = true;
      }
      this.departureInfo = draft.departureInfo;
      this.arrivalInfo = draft.arrivalInfo;
      this.constraintsInfo = draft.constraintsInfo;
    }
  }

  departure(info) {
    timer(1000).subscribe(() => this.fromExtended = false);
    this.departureInfo = info;
  }

  arrival(info) {
    this.arrivalInfo = info;
    timer(1000).subscribe(() => this.locationEven = true);
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

  save() {
    this.loading = true;
    const tripBatch = this.generateTripBatch();
    this.userService.getCurrentUser()
    .subscribe(
      (user) => {
        if (user) {
          this.postService.createTrip(tripBatch)
          .subscribe(response => {
            this.loading = false;
            if (response.status) {
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
    this.dialog.open(NotConnectedComponent, {
      width: '80vw',
      maxWidth: '500px',
      height: '50vh',
      maxHeight: '300px'
    });
  }

  private generateTripBatch() {
    const tripBatch = [];
    const arrivalTime = moment(this.arrivalInfo.time, 'HH:mm');
    const trip = new Trip({
      from : {
        label: this.departureInfo.city
      },
      to : {
        label: this.arrivalInfo.city
      },
      date: moment(this.arrivalInfo.date).hours(arrivalTime.hours()).minutes(arrivalTime.minutes()),
      ...this.constraintsInfo
    });
    tripBatch.push(trip);
    if (this.return && this.returnInfo.from && this.returnInfo.to) {
      const returnTime = moment(this.returnInfo.to.time);
      const returnTrip = new Trip({
        from : {
          label: this.returnInfo.from.city
        },
        to: {
          label: this.returnInfo.to.city
        },
        date: moment(this.returnInfo.to.date).hours(returnTime.hours()).minutes(returnTime.minutes()),
        ...this.constraintsInfo
      });
      tripBatch.push(returnTrip);
    }
    return tripBatch;
  }

}
