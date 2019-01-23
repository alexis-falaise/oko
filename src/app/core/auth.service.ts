import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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
  ) { }

  onUser(): Observable<User> {
    return this.currentUser.asObservable();
  }

  onStatus(): Observable<Status> {
    return this.status.asObservable();
  }

  onLoginStatus(): Observable<boolean> {
    return this.logged.asObservable();
  }

  /**
  * Get current logging status
  * @returns Observable<{status: boolean, user: User}>
  */
  getLoginStatus(): Observable<Object> {
    return this.http.get(`${this.authUrl}/status`);
  }

  /**
   * Log a user into oko servers
   * Returns an User object
   * @param login: Login used for authentication (email)
   * @param password: Password user for authentication
   * @returns Object { status: boolean, message: string }
   */
  login(login: string, password: string) {
    this.http.post(`${this.authUrl}/login`, {login: login, password: password})
    .subscribe((loginInfo: any) => {
      if (loginInfo.status) {
        this.currentUser.next(loginInfo.user);
      }
      this.status.next({ status: loginInfo.status, message: loginInfo.message });
    });
  }

  /**
   * Register a user into oko database
   * @param userForm: User data from signin form
   */

  signin(userForm) {
    delete userForm.passwordConfirm;
    return this.http.post(`${this.authUrl}/signin`, userForm);
  }
}
