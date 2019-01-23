import { Component, OnInit } from '@angular/core';
import { AuthService } from '@core/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'oko';
  logged = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.onStatus()
    .subscribe((status: any) => {
      console.log('On status', status);
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
