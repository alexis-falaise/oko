import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '@core/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    const socialAuthenticated = this.authService.isSocialAuthenticated();
    console.log('Is social authenticated', socialAuthenticated);
    if (socialAuthenticated) {
      this.authService.socialDisconnection().subscribe(disconnected => {
        if (disconnected) {
          this.authService.logout();
        } else {
          this.router.navigate(['/home']);
        }
      });
    } else {
      this.authService.logout();
    }
  }

}
