import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
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
    const logged = this.authService.isLogged();
    this.historyService.add(this.router.url);
    if (!logged) {
      this.router.navigate(['/login']);
    }
    return this.authService.isLogged();
  }
}
