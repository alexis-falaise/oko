import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { environment } from '@env/environment';
import { User } from '@models/user.model';

class Status {
  status: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private serverUrl = environment.serverUrl;
  private authUrl = `${this.serverUrl}/auth`;
  private logged = new BehaviorSubject(false);
  private currentUser = new BehaviorSubject<User>(null);
  private status = new BehaviorSubject(null);

  constructor(
    private router: Router,
    private http: HttpClient,
    private snack: MatSnackBar,
  ) { }

  onUser(): Observable<User> {
    return this.currentUser.asObservable();
  }

  /**
   * @returns Observable<{status: boolean, user: User}>
   */
  onStatus(): Observable<Status> {
    return this.status.asObservable();
  }

  /**
  * Get current logging status as cold Observable.
  * Component needs to subscribe to onStatus() for basic log info
  * or onUser() for detailled user info
  */
  getLoginStatus() {
    this.http.get(`${this.authUrl}/status`, { withCredentials: true })
    .subscribe((status: any) => {
      this.status.next(status);
      this.currentUser.next(status.user);
    });
  }


  /**
   * Helper function for login status
   * @returns boolean: Login state
   */
  isLogged(): boolean {
    const status = this.status.getValue();
    if (status) {
      return status.status;
    } else {
      return false;
    }
  }

  /**
   * Log a user into oko servers
   * Returns an User object
   * @param login: Login used for authentication (email)
   * @param password: Password user for authentication
   * @returns Object { status: boolean, message: string }
   */
  login(login: string, password: string) {
    this.http.post(`${this.authUrl}/login`, {login: login, password: password},
    { withCredentials: true })
    .subscribe((loginInfo: any) => {
      if (loginInfo.status) {
        this.currentUser.next(loginInfo.user);
        this.snack.open('Vous êtes connecté !', undefined, {duration: 2500});
      }
      this.status.next(loginInfo);
    });
  }


  /**
   * Log a user out
   */
  logout() {
    this.http.get(`${this.authUrl}/logout`,  { withCredentials: true })
    .subscribe((logoutInfo: any) => {
      if (logoutInfo.status) {
        this.currentUser.next(null);
        this.status.next({ status: false, message: 'Successfully disconnected' });
        this.router.navigate(['login']);
      }
    });
  }

  /**
   * Register a user into oko database
   * @param userForm: User data from signin form
   */
  signin(userForm) {
    delete userForm.passwordConfirm;
    return this.http.post(`${this.authUrl}/signin`, userForm, { withCredentials: true });
  }
}
