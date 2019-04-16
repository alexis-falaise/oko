import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, observable, Subject } from 'rxjs';
import { AuthService } from '@core/auth.service';
import { HistoryService } from '@core/history.service';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private historyService: HistoryService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return Observable.create(observer => {
      const gotStatus = new Subject();
      this.historyService.add(this.router.url);
      const logged = this.authService.isLogged();
      if (logged) {
        observer.next(true);
        observer.complete();
      } else {
        this.authService.getLoginStatus();
        this.authService.onStatus()
        .pipe(takeUntil(gotStatus))
        .subscribe(status => {
          if (status) {
            if (!status.status) {
              this.router.navigate(['/login']);
            }
            observer.next(status.status);
            observer.complete();
            gotStatus.next(true);
          }
        });
      }
    });
  }
}
