import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private logged = new BehaviorSubject(true);

  constructor(private router: Router) { }

  onLoginState(): Observable<boolean> {
    return this.logged.asObservable();
  }

  getLoginState(): boolean {
    return this.logged.getValue();
  }

  login() {
    this.logged.next(true);
    this.router.navigate(['/']);
  }
}
