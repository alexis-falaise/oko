import { Component, OnInit } from '@angular/core';
import { UserService } from '@core/user.service';
import { User } from '@models/user.model';
import { Link } from '@models/link.model';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  currentUser: User = null;
  categories: Array<Link> = [
    { label: 'Mes infos', path: '/account/info' },
    { label: 'Mes demandes', path: '/account/request' },
    { label: 'Mes trajets', path: '/account/trip' },
    { label: 'Mes articles', path: '/account/item' },
  ];

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
