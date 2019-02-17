import { Component, OnInit } from '@angular/core';
import { AuthService } from '@core/auth.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'oko';
  logged = false;
  displayNav = false;
  hideNavOn = ['/login', '/logout', '/signin'];

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.displayNav = this.hideNavOn.findIndex(item => item === event.url) === -1;
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
}
