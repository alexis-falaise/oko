import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, observable } from 'rxjs';
import { AuthService } from '@core/auth.service';
import { HistoryService } from '@core/history.service';

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
      this.historyService.add(this.router.url);
      const logged = this.authService.isLogged();
      if (logged) {
        observer.next(true);
        observer.complete();
      } else {
        this.authService.getLoginStatus();
        this.authService.onStatus().subscribe(status => {
          if (status) {
            if (!status.status) {
              this.router.navigate(['/login']);
            }
            observer.next(status.status);
            observer.complete();
          }
        });
      }
    });
  }
}
