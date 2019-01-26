import { Injectable } from '@angular/core';
import { Router, NavigationEnd, NavigationStart, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  history = new BehaviorSubject([]);

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
    const history = this.history.getValue();
    history.push(url);
    this.history.next(history);
  }

  back() {
    const history = this.history.getValue();
    const route = history.pop();
    this.history.next(history);
    this.router.navigate([route]);
  }
}
