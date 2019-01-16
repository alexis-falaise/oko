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
    this.authService.onLoginState()
    .subscribe(state => this.logged = state);
  }
}
