import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { Observable, BehaviorSubject } from 'rxjs';

import { environment } from '@env/environment';


import { UiService } from '@core/ui.service';
import { HistoryService } from '@core/history.service';

import { User } from '@models/user.model';
import { ServerResponse } from '@models/app/server-response.model';
import { Request } from '@models/post/request.model';
import { Trip } from '@models/post/trip.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private userUrl = `${environment.serverUrl}/user`;
  private tripUrl = `${environment.serverUrl}/trip`;
  private requestUrl = `${environment.serverUrl}/request`;
  private currentUser = new BehaviorSubject<User>(null);

  constructor(
    private snack: MatSnackBar,
    private historyService: HistoryService,
    private uiService: UiService,
    private http: HttpClient
  ) { }

  /**
   * 
   *  USERS
   * 
   */

  /**
   * Get all users
   */
  getUsers(): Observable<Array<User>> {
    return Observable.create(observer => {
      this.http.get(`${this.userUrl}/`)
      .subscribe((users: Array<User>) => {
        const outputUsers = users.map(user => new User(user));
        observer.next(outputUsers);
        observer.complete();
      }, (error) => this.uiService.serverError(error));
    });
  }

  /**
   * Sets a given user as Oko administrator
   * @param userId : User unique database identifier
   * @param admin: Administrator status
   */
  setUserAsAdmin(userId: string, admin: boolean): Observable<User> {
    return Observable.create(observer => {
      this.http.post(`${this.userUrl}/${userId}/admin`, {admin: admin})
      .subscribe((user: User) => {
        const outputUser = new User(user);
        observer.next(outputUser);
        observer.complete();
      }, (error) => this.uiService.serverError(error));
    });
  }

  deleteUser(user: User) {
    this.http.delete(`${this.userUrl}/${user.id}`)
    .subscribe((response: ServerResponse) => {
      if (response.status) {
        this.snack.open(`${user.firstname} a été supprimé`, 'OK', {duration: 5000});
        this.historyService.parent();
      }
    }, (error) => this.uiService.serverError(error));
  }

  /**
   * USER VIEW MANAGEMENT
   */

  onCurrentUser() {
    return this.currentUser.asObservable();
  }

  setCurrentUser(user: User) {
    this.currentUser.next(user);
  }

  resetCurrentUser() {
    this.currentUser.next(null);
  }

  /**
   *
   * TRIPS
   *
   */

  getTrips(): Observable<Array<Trip>> {
    return this.http.get(`${this.tripUrl}`) as Observable<Array<Trip>>;
  }

  approveTrip(trip: Trip): Observable<Trip> {
    return this.http.get(`${this.tripUrl}/${trip.id}/approve`) as Observable<Trip>;
  }

  revokeTripApproval(trip: Trip): Observable<Trip> {
    return this.http.get(`${this.tripUrl}/${trip.id}/approval/revoke`) as Observable<Trip>;
  }

  dismissTrip(trip: Trip): Observable<Trip> {
    return this.http.get(`${this.tripUrl}/${trip.id}/dismiss`) as Observable<Trip>;
  }

  revokeTripDismissal(trip: Trip): Observable<Trip> {
    return this.http.get(`${this.tripUrl}/${trip.id}/dismissal/revoke`) as Observable<Trip>;
  }


  /**
   *
   * REQUESTS
   *
   */

  getRequests(): Observable<Array<Request>> {
    return this.http.get(`${this.requestUrl}`) as Observable<Array<Request>>;
  }

  approveRequest(request: Request): Observable<Request> {
    return this.http.get(`${this.requestUrl}/${request.id}/approve`) as Observable<Request>;
  }

  revokeRequestApproval(request: Request): Observable<Request> {
    return this.http.get(`${this.requestUrl}/${request.id}/approval/revoke`) as Observable<Request>;
  }

  dismissRequest(request: Request): Observable<Request> {
    return this.http.get(`${this.requestUrl}/${request.id}/dismiss`) as Observable<Request>;
  }

  revokeRequestDismissal(request: Request): Observable<Request> {
    return this.http.get(`${this.requestUrl}/${request.id}/dismissal/revoke`) as Observable<Request>;
  }

}
