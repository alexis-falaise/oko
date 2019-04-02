import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatDialog } from '@angular/material';
import {
  AuthService as SocialService,
  GoogleLoginProvider,
  FacebookLoginProvider,
  SocialUser
} from 'angularx-social-login';
import { BehaviorSubject, Observable, of, observable, Subject } from 'rxjs';

import { environment } from '@env/environment';
import { User } from '@models/user.model';
import { ServerResponse } from '@models/app/server-response.model';
import { SocialDisconnectionComponent } from './dialogs/social-disconnection/social-disconnection.component';
import { takeUntil } from 'rxjs/operators';

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
  private nextAuthentication = new Subject();
  private status = new BehaviorSubject(null);
  private socialProfile = new BehaviorSubject<User>(null);
  private socialAuthenticated = null;

  constructor(
    private router: Router,
    private http: HttpClient,
    private social: SocialService,
    private snack: MatSnackBar,
    private dialog: MatDialog,
  ) { }

  onUser(): Observable<User> {
    return this.currentUser.asObservable();
  }

  onSocialProfile(): Observable<User> {
    return this.socialProfile.asObservable();
  }

  /**
   * @returns Observable<{status: boolean, user: User}>
   */
  onStatus(): Observable<Status> {
    return this.status.asObservable();
  }

  /**
  * Get current login status as cold Observable.
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
   * Helper function for social authentication
   */
  isSocialAuthenticated(): boolean {
    return this.socialAuthenticated;
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
        this.logUserIn(loginInfo.user);
      }
      this.status.next(loginInfo);
    });
  }

  googleConnection() {
    this.social.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  facebookConnection() {
    this.social.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  socialDisconnection(): Observable<boolean> {
    return Observable.create(observer => {
      this.http.get(`${this.authUrl}/social/info`, { withCredentials: true })
      .subscribe((response: ServerResponse) => {
        if (response.status) {
          const dialogRef = this.dialog.open(SocialDisconnectionComponent, {
            data: response.data,
            height: '50vh',
          });
          dialogRef.afterClosed().subscribe((userChoice) => {
            if (userChoice) {
              this.social.signOut(true);
            }
            observer.next(userChoice);
            observer.complete();
          });
        } else {
          observer.next(false);
          observer.complete();
        }
      });
    });
  }

  socialAuthentication(user: SocialUser) {
    this.http.post(`${this.authUrl}/social`, user, { withCredentials: true })
    .subscribe((socialResponse: any) => {
      if (socialResponse.status) {
        this.socialProfile.next(null);
        if (socialResponse.code === 'LOG_IN' && socialResponse.user) {
          this.logUserIn(socialResponse.user);
        }
        if (socialResponse.code === 'PARTIAL') {
          const socialProfile = new User({
            email: user.email,
            firstname: user.firstName,
            lastname: user.lastName,
            avatar: user.photoUrl,
            socialToken: user.authToken,
            socialProvider: user.provider
          });
          this.socialProfile.next(socialProfile);
        }
      }
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
   * @param user: User data from signin form
   */
  signin(user: User): Observable<ServerResponse> {
    return this.http.post(`${this.authUrl}/signin`, user, { withCredentials: true }) as Observable<ServerResponse>;
  }

  checkSocialAuthentication() {
    if (!this.socialAuthenticated) {
      this.social.authState
      .pipe(takeUntil(this.nextAuthentication))
      .subscribe(user => {
        this.nextAuthentication.next(true);
        this.socialAuthenticated = true;
        this.socialAuthentication(user);
      });
    }
  }

  private logUserIn(user: User) {
    this.currentUser.next(user);
    this.snack.open('Vous êtes connecté !', undefined, {duration: 2500});
    this.router.navigate(['/home']);
  }
}
