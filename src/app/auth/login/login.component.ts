import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '@core/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
  loading: boolean;
  ngUnsubscribe = new Subject();

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.loading = true;
    this.authService.onStatus()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((status: any) => {
      this.loading = false;
      if (status) {
        this.status = status.status;
        if (status.status) {
          this.router.navigate(['/home']);
        }
        if (status.code === 'PASSWORD_ERROR' || status.code === 'BODY_ERROR') {
          this.message = status.message;
        }
      }
    });
  }

  login() {
    this.loading = true;
    this.authService.login(this.email, this.password);
  }

  signin() {
    this.router.navigate(['signin']);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

}
