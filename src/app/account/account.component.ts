import { Component, OnInit } from '@angular/core';
import { UserService } from '@core/user.service';
import { User } from '@models/user.model';
import { Link } from '@models/link.model';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

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
    // { label: 'Articles', path: '/account/item', icon: 'shopping_cart' },
  ];

  constructor(
    private userService: UserService,
    private snack: MatSnackBar,
    private router: Router,
  ) { }

  ngOnInit() {
    this.userService.getCurrentUser()
    .subscribe(user => {
      if (user) {
        this.currentUser = user;
      } else {
        const snackRef = this.snack.open('Vous avez été déconnecté', 'Reconnexion');
        snackRef.onAction().subscribe(() => {
          this.router.navigate(['/login']);
        });
      }
    });
  }

}
