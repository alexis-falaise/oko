import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSnackBar, MatSort } from '@angular/material';
import * as moment from 'moment';
import { sortByDate } from '@utils/array.util';

import { UiService } from '@core/ui.service';
import { AdminService } from '../admin.service';

import { Trip } from '@models/post/trip.model';
import { PostService } from '@core/post.service';

@Component({
  selector: 'app-admin-trip',
  templateUrl: './admin-trip.component.html',
  styleUrls: ['./admin-trip.component.scss']
})
export class AdminTripComponent implements OnInit {
  trips: Array<Trip>;
  expandedTrip: Trip = null;
  displayedColumns = [
    'from',
    'to',
    'departureDate',
    'date',
    'submitDate',
    'private',
    'status',
    'clicks',
    'views',
  ];
  displayedHeaders = {
    'from': 'Départ',
    'to': 'Arrivée',
    'departureDate': 'Date départ',
    'date': 'Date arrivée',
    'submitDate': 'Posté le',
    'private': 'Privé',
    'status': 'Status',
    'clicks': 'Clics',
    'views': 'Vues',
  };
  tripsSource = new MatTableDataSource(this.trips);
  @ViewChild(MatSort) sort: MatSort;
  moment = moment;

  constructor(
    private adminService: AdminService,
    private postService: PostService,
    private snack: MatSnackBar,
    private uiService: UiService,
  ) { }

  ngOnInit() {
    this.adminService.getTrips()
    .subscribe((trips) => {
      const formattedTrips = trips.map(trip => new Trip(trip)).sort(sortByDate);
      this.trips = formattedTrips;
      this.updateDataSource(formattedTrips);
    });
  }

  displayTrip(trip: Trip) {
    this.expandedTrip = this.expandedTrip === trip ? null : trip;
  }

  filterTrips(filter: string) {
    this.tripsSource.filter = filter;
  }

  approveTrip(trip: Trip) {
    this.adminService.approveTrip(trip)
    .subscribe((receivedTrip) => {
      this.snack.open('Trajet approuvé', 'OK', {duration: 3000});
      this.updateTrip(receivedTrip);
    }, (error) => this.uiService.serverError(error));
  }

  revokeApproval(trip: Trip) {
    this.adminService.revokeTripApproval(trip)
    .subscribe((receivedTrip) => {
      this.snack.open('Approbation annulée', 'OK', {duration: 3000});
      this.updateTrip(receivedTrip);
    }, (error) => this.uiService.serverError(error));
  }

  dismissTrip(trip: Trip) {
    this.adminService.dismissTrip(trip)
    .subscribe((receivedTrip) => {
      this.snack.open('Trajet refusé', 'OK', {duration: 3000});
      this.updateTrip(receivedTrip);
    }, (error) => this.uiService.serverError(error));
  }

  revokeDismissal(trip: Trip) {
    this.adminService.revokeTripDismissal(trip)
    .subscribe((receivedTrip) => {
      this.snack.open('Refus annulé', 'OK', {duration: 3000});
      this.updateTrip(receivedTrip);
    }, (error) => this.uiService.serverError(error));
  }

  removeTrip(trip: Trip) {
    const snackRef = this.snack.open('Êtes-vous sur ?', 'Oui chef', {duration: 10000});
    snackRef.onAction().subscribe(() => {
      this.postService.removeTrip(trip)
      .subscribe((response) => {
        if (response.status) {
          this.snack.open('Annonce supprimée', 'OK', {duration: 3000});
          this.removeTripFromData(trip);
        }
      });
    });
  }

  private updateTrip(trip: Trip) {
    const tripIndex = this.trips.findIndex(tabTrip => tabTrip._id === trip._id);
    this.trips[tripIndex] = new Trip(trip);
    this.updateDataSource(this.trips);
  }

  private updateDataSource(trips: Array<Trip>) {
    this.tripsSource.data = trips;
    this.tripsSource.sort = this.sort;
  }

  private removeTripFromData(trip: Trip) {
    const tripIndex = this.trips.findIndex(tabTrip => tabTrip._id === trip._id);
    this.trips.splice(tripIndex, 1);
    this.updateDataSource(this.trips);
  }

}
