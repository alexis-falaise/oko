import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '@core/user.service';
import { UiService } from '@core/ui.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private uiService: UiService,
    private router: Router,
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return Observable.create(observer => {
      this.userService.getCurrentUser().subscribe((user) => {
        if (user && user.admin) {
          observer.next(true);
          observer.complete();
        } else {
          this.router.navigate(['/home']);
          observer.next(false);
          observer.complete();
        }
      }, (error) => {
        this.uiService.serverError(error);
          observer.next(false);
          observer.complete();
      });
    });
  }
}
