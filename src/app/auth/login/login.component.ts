import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '@core/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UiService } from '@core/ui.service';
import { HistoryService } from '@core/history.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  email: string;
  password: string;
  status: boolean;
  message: string;
  ngUnsubscribe = new Subject();

  constructor(
    private authService: AuthService,
    private historyService: HistoryService,
    private uiService: UiService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.uiService.setLoading(true);
    this.authService.onStatus()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((status: any) => {
      if (status) {
        this.status = status.status;
        if (status.status) {
          this.ngUnsubscribe.next();
          if (this.historyService.hasBack()) {
            this.historyService.back(1);
          } else {
            this.router.navigate(['/home']);
          }
        }
        if (status.code === 'PASSWORD_ERROR' || status.code === 'BODY_ERROR') {
          this.message = status.message;
        }
      }
      this.uiService.setLoading(false);
    });
    this.authService.getLoginStatus();
  }

  login() {
    this.uiService.setLoading(true);
    this.authService.login(this.email, this.password);
  }

  facebookConnect() {
    this.authService.facebookConnection();
  }

  // googleConnect() {
  //   this.authService.googleConnection();
  // }

  signin() {
    this.router.navigate(['signin']);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }


}
