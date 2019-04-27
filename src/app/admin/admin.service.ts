import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@env/environment';

import { UserService } from '@core/user.service';

import { User } from '@models/user.model';
import { UiService } from '@core/ui.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private userUrl = `${environment.serverUrl}/user`;

  constructor(
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
}
