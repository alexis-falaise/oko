import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { Observable, BehaviorSubject } from 'rxjs';

import { environment } from '@env/environment';


import { UiService } from '@core/ui.service';
import { HistoryService } from '@core/history.service';

import { User } from '@models/user.model';
import { ServerResponse } from '@models/app/server-response.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private userUrl = `${environment.serverUrl}/user`;
  private currentUser = new BehaviorSubject<User>(null);

  constructor(
    private snack: MatSnackBar,
    private historyService: HistoryService,
    private uiService: UiService,
    private http: HttpClient
  ) { }

  /**
   * Get all users
   */
  getUsers(): Observable<Array<User>> {
    return Observable.create(observer => {
      this.http.get(`${this.userUrl}/`, {withCredentials: true})
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
      console.log('Set user as admin', admin);
      this.http.post(`${this.userUrl}/${userId}/admin`, {admin: admin}, {withCredentials: true})
      .subscribe((user: User) => {
        const outputUser = new User(user);
        observer.next(outputUser);
        observer.complete();
      }, (error) => this.uiService.serverError(error));
    });
  }

  deleteUser(user: User) {
    this.http.delete(`${this.userUrl}/${user.id}`, {withCredentials: true})
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
}
