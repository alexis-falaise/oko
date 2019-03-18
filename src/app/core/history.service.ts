import { Injectable } from '@angular/core';
import { Router, NavigationEnd, NavigationStart, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  history = new BehaviorSubject([]);
  forbiddenRoutes = ['/login', '/signin', '/logout'];

  constructor(private router: Router, private route: ActivatedRoute) {
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

  back() {
    const history = this.history.getValue();
    history.pop();
    let route;
    do {
      route = this.findLastRoute(history);
    } while (this.forbiddenRoutes.includes(route));
    this.history.next(history);
    this.router.navigate([route]);
  }

  hasBack(): boolean {
    const history = this.history.getValue();
    return history.length && history[history.length - 1];
  }
}
