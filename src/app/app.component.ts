import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd, NavigationStart, NavigationCancel, NavigationError } from '@angular/router';
import * as moment from 'moment';

import { AuthService } from '@core/auth.service';
import { UiService } from '@core/ui.service';
import { HistoryService } from '@core/history.service';
import { NotificationService } from '@core/notification.service';
import { Socket } from 'ngx-socket-io';

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
  mainLoading: boolean;
  randomWelcome: string;
  username: string;
  hideNavOn = ['/login', '/logout', '/signin'];
  lightNavOn = ['/post', '/account', '/messages', '/profile', '/landing'];

  constructor(
    private authService: AuthService,
    private historyService: HistoryService,
    private notificationService: NotificationService,
    private socket: Socket,
    private uiService: UiService,
    private ref: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit() {
    this.socket.on('connected', (data) => console.log('IO:', data.message));
    moment.locale('fr');
    this.hideDrawer();
    this.uiService.onLoading().subscribe(loadingState => {
      this.loading = loadingState;
      this.ref.detectChanges();
    });
    this.uiService.onMainLoading().subscribe(loadingState => {
      this.mainLoading = loadingState;
      this.ref.detectChanges();
    });
    this.router.onSameUrlNavigation = 'reload';
    this.router.events.subscribe(event => {
      switch (true) {
        case event instanceof NavigationStart:
          this.uiService.setMainLoading(true);
          this.randomWelcome = this.uiService.generateRandomWelcome(this.username);
          break;
        case event instanceof NavigationCancel:
        case event instanceof NavigationError:
        case event instanceof NavigationEnd:
          this.uiService.setMainLoading(false);
      }
      if (event instanceof NavigationEnd) {
        this.displayNav = this.hideNavOn.findIndex(item => item === event.url) === -1;
        this.lightNav = this.lightNavOn.findIndex(item => event.url.includes(item)) !== -1;
        if (event.url.includes('/messages')) {
          this.notificationService.disableMessageNotifications();
        } else {
          console.log('Not in messages');
          this.notificationService.enableMessageNotifications();
        }
      }
    });
    this.authService.onStatus()
    .subscribe((status: any) => {
      if (status && status.status) {
        this.username = status.user.firstname;
        this.randomWelcome = this.uiService.generateRandomWelcome(this.username);
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

  /** Don't do anything on context menu trigger */
  nope() {}
}
