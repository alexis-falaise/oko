import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../admin.service';
import * as moment from 'moment';

import { UiService } from '@core/ui.service';
import { Request } from '@models/post/request.model';
import { PostService } from '@core/post.service';
import { sortByDate } from '@utils/array.util';
@Component({
  selector: 'app-admin-request',
  templateUrl: './admin-request.component.html',
  styleUrls: ['./admin-request.component.scss']
})
export class AdminRequestComponent implements OnInit {
  requests: Array<Request>;
  requestsSource = new MatTableDataSource();
  expandedRequest: Request;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  displayedColumns = [
    'firstname',
    'lastname',
    'submitDate',
    'firstItem',
    'items',
    'bonus',
    'urgent',
    'price',
    'status',
  ];
  displayedHeaders = {
    'firstname': 'Prénom',
    'lastname': 'Nom',
    'submitDate': 'Posté le',
    'firstItem': 'Premier article',
    'items': 'Articles',
    'bonus': 'Bonus',
    'urgent': 'Urgent',
    'price': 'Prix',
    'status': 'Status',
  };
  moment = moment;

  constructor(
    private adminService: AdminService,
    private postService: PostService,
    private snack: MatSnackBar,
    private uiService: UiService
  ) { }

  ngOnInit() {
    this.adminService.getRequests()
    .subscribe((requests) => {
      if (requests && requests.length) {
        const formattedRequests = requests.map(request => new Request(request)).sort(sortByDate);
        this.requests = formattedRequests;
        this.updateDataSource(formattedRequests);
      }
    });
  }

  displayRequest(request: Request) {
    this.expandedRequest = this.expandedRequest === request ? null : request;
  }

  filterRequests(filter: string) {
    this.requestsSource.filter = filter;
  }

  approveRequest(request: Request) {
    this.adminService.approveRequest(request)
    .subscribe((receivedRequest) => {
      this.snack.open('Annonce approuvée', 'OK', {duration: 3000});
      this.updateRequest(receivedRequest);
    }, (error) => this.uiService.serverError(error));
  }

  revokeApproval(request: Request) {
    this.adminService.revokeRequestApproval(request)
    .subscribe((receivedRequest) => {
      this.snack.open('Approbation annulée', 'OK', {duration: 3000});
      this.updateRequest(receivedRequest);
    }, (error) => this.uiService.serverError(error));
  }

  dismissRequest(request: Request) {
    this.adminService.dismissRequest(request)
    .subscribe((receivedRequest) => {
      this.snack.open('Annonce refusée', 'OK', {duration: 3000});
      this.updateRequest(receivedRequest);
    }, (error) => this.uiService.serverError(error));
  }

  revokeDismissal(request: Request) {
    this.adminService.revokeRequestDismissal(request)
    .subscribe((receivedRequest) => {
      this.snack.open('Refus annulé', 'OK', {duration: 3000});
      this.updateRequest(receivedRequest);
    }, (error) => this.uiService.serverError(error));
  }

  removeRequest(request: Request) {
    const snackRef = this.snack.open('Ëtes vous sur?', 'Oui chef', {duration: 10000});
    snackRef.onAction().subscribe(() => {
      this.postService.removeRequest(request)
      .subscribe((response) => {
        if (response.status) {
          this.snack.open('Annonce supprimée', 'OK', {duration: 3000});
          this.removeRequestFromData(request);
        }
      });
    });
  }

  private updateDataSource(requests: Array<Request>) {
    this.requestsSource.data = requests;
    this.requestsSource.sort = this.sort;
  }

  private updateRequest(request: Request) {
    const requestIndex = this.requests.findIndex(tabTrip => tabTrip._id === request._id);
    this.requests[requestIndex] = new Request(request);
    this.updateDataSource(this.requests);
  }

  private removeRequestFromData(request: Request) {
    const requestIndex = this.requests.findIndex(tabTrip => tabTrip._id === request._id);
    this.requests.splice(requestIndex, 1);
    this.updateDataSource(this.requests);
  }

}
