import { Component, OnInit } from '@angular/core';
import { UserService } from '@core/user.service';
import { User } from '@models/user.model';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  currentUser: User = null;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userService.getCurrentUser()
    .subscribe(user => {
      if (user) {
        this.currentUser = user;
      }
    });
  }

}
