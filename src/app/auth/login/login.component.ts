import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '@core/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  status: boolean;
  message: string;
  loading: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.authService.onStatus()
    .subscribe((status: any) => {
      console.log(status);
      this.loading = false;
      if (status) {
        this.status = status.status;
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

}
