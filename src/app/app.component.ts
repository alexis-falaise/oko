import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, NavigationStart, NavigationCancel, NavigationError } from '@angular/router';
import * as moment from 'moment';
import { takeUntil } from 'rxjs/operators';
import { Subject, timer } from 'rxjs';

import { AuthService } from '@core/auth.service';
import { UiService } from '@core/ui.service';
import { NotificationService } from '@core/notification.service';
import { Socket } from 'ngx-socket-io';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InstallComponent } from '@core/dialogs/install/install.component';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'oko';
  logged = false;
  displayNav = false;
  lightNav = false;
  drawerExpanded = false;
  standaloneMode = false;
  loading: boolean;
  mainLoading: boolean;
  randomWelcome: string;
  username: string;
  ngUnsubscribe = new Subject();
  nextStatus = new Subject();
  connection = new Subject();
  isDisconnected = false;
  navPosition = 0;
  hideNavOn = ['/login', '/logout', '/signin', '/oneclick'];
  lightNavOn = ['/home', '/post', '/account', '/messages', '/profile', '/landing', '/admin'];

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private uiService: UiService,
    private dialog: MatDialog,
    private ref: ChangeDetectorRef,
    private deviceDetector: DeviceDetectorService,
    private router: Router,
    private socket: Socket,
    private snack: MatSnackBar,
  ) { }

  ngOnInit() {
    moment.locale('fr');
    this.connectServer();
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
          this.uiService.setLoading(true);
          this.randomWelcome = this.uiService.generateRandomWelcome(this.username);
          break;
        case event instanceof NavigationCancel:
        case event instanceof NavigationError:
        case event instanceof NavigationEnd:
          this.uiService.setLoading(false);
      }
      if (event instanceof NavigationEnd) {
        this.displayNav = this.hideNavOn.findIndex(item => item === event.url) === -1;
        this.lightNav = this.lightNavOn.findIndex(item => event.url.includes(item)) !== -1;
        if (event.url.includes('/messages')) {
          this.notificationService.disableMessageNotifications();
        } else {
          this.notificationService.enableMessageNotifications();
        }
      }
    });
    this.authService.onStatus()
    .pipe(takeUntil(this.ngUnsubscribe || this.nextStatus))
    .subscribe((status: any) => {
      this.nextStatus.next(true);
      if (status) {
        if (status.status) {
          this.username = status.user.firstname;
          this.randomWelcome = this.uiService.generateRandomWelcome(this.username);
          this.updateLogStatus(status.status);
        } else {
          this.authService.checkSocialAuthentication();
          this.updateLogStatus(false);
        }
      }
    });
    this.authService.getLoginStatus();
    this.standaloneMode = window.matchMedia('(display-mode: standalone)').matches;
    this.promptInstall();
  }

  install() {
    this.dialog.open(InstallComponent, {
      height: '80vh',
      width: '80vw',
    });
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

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private connectServer() {
    this.socket.connect();
    this.socket.on('connect', () => {
      this.authService.getUserIp()
      .subscribe((info) => {
        this.socket.emit('userip', info);
      });
    });
    this.socket.on('disconnect', () => {
      timer(5000).pipe(takeUntil(this.connection))
      .subscribe(() => {
        this.isDisconnected = true;
        this.snack.open('Petit problème réseau...', 'OK', {duration: 7500});
      });
      this.socket.once('connect', () => {
        this.connection.next(true);
        if (this.isDisconnected) {
          this.snack.open('Le réseau est rétabli', 'Top', {duration: 5000});
          this.isDisconnected = false;
        }
      });
    });
  }

  private promptInstall() {
    const browser = this.deviceDetector.browser;
    const isDesktop = this.deviceDetector.isDesktop();
    if (browser === 'Chrome' || !isDesktop) {
      timer(15000).subscribe(() => {
        if (!this.standaloneMode && !this.username) {
          this.install();
        }
      });
    }
  }
}
