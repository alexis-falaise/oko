import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import * as moment from 'moment';

import { AuthService } from '@core/auth.service';
import { UiService } from '@core/ui.service';
import { HistoryService } from '@core/history.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'oko';
  logged = false;
  displayNav = false;
  lightNav = false;
  drawerExpanded = false;
  loading: boolean;
  hideNavOn = ['/login', '/logout', '/signin'];
  lightNavOn = ['/post'];

  constructor(
    private authService: AuthService,
    private historyService: HistoryService,
    private uiService: UiService,
    private ref: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit() {
    moment.locale('fr');
    this.hideDrawer();
    this.uiService.onLoading().subscribe(loadingState => {
      this.loading = loadingState;
      this.ref.detectChanges();
    });
    // this.uiService.onLoading().subscribe(loadingState => this.loading = loadingState);
    this.router.onSameUrlNavigation = 'reload';
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.displayNav = this.hideNavOn.findIndex(item => item === event.url) === -1;
        this.lightNav = this.lightNavOn.findIndex(item => event.url.includes(item)) !== -1;
      }
    });
    this.authService.onStatus()
    .subscribe((status: any) => {
      if (status) {
        this.updateLogStatus(status.status);
      } else {
        this.updateLogStatus(false);
      }
    });
    this.authService.getLoginStatus();
  }

  updateLogStatus(status: boolean) {
    this.logged = status;
  }

  displayDrawer() {
    this.drawerExpanded = true;
  }

  hideDrawer() {
    this.drawerExpanded = false;
  }

  manageDrawer(state) {
    this.drawerExpanded = state;
  }

  toggleDrawer() {
    this.drawerExpanded = !this.drawerExpanded;
  }

  back() {
    window.history.back();
  }
}
