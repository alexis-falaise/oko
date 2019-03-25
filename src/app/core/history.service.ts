import { Injectable } from '@angular/core';
import { Router, NavigationEnd, NavigationStart, ActivatedRoute, UrlSerializer } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  history = new BehaviorSubject([]);
  forbiddenRoutes = ['/login', '/signin', '/logout'];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private serializer: UrlSerializer
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.add(event.url);
      }
    });
  }

  onHistory() {
    return this.history.asObservable();
  }

  add(url: string) {
    if (url !== '/' && url !== '') {
      const history = this.history.getValue();
      history.push(url);
      this.history.next(history);
    }
  }

  findLastRoute(history): string {
    return history.pop();
  }

  getLastRoute(history): string {
    if (history && history.length) {
      return history[history.length - 1];
    } else {
      return '/home';
    }
  }

  getParentRoute(url: string) {
    const parsed = url.split('/');
    parsed.pop();
    return parsed.join('/');
  }

  back() {
    const history = this.history.getValue();
    const lastRoute = this.getLastRoute(history);
    const parentRoute = this.getParentRoute(lastRoute);
    if (parentRoute) {
      this.router.navigate([parentRoute]);
    } else {
      this.router.navigate(['/home']);
    }
  }

  hasBack(): boolean {
    const history = this.history.getValue();
    return history.length && history[history.length - 1];
  }
}
