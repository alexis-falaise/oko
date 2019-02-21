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
    { label: 'Infos', path: '/account/info', icon: 'account_box' },
    { label: 'Trajets', path: '/account/trip', icon: 'explore' },
    { label: 'Demandes', path: '/account/request', icon: 'new_releases' },
    { label: 'Articles', path: '/account/item', icon: 'shopping_cart' },
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
