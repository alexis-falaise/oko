import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar, MatBottomSheet } from '@angular/material';

import { UserService } from '@core/user.service';

import { AccountAvatarUploadComponent } from './account-avatar-upload/account-avatar-upload.component';

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
    { label: 'Propositions', path: '/account/proposal', icon: 'announcement'},
    { label: 'Trajets', path: '/account/trip', icon: 'explore' },
    { label: 'Demandes', path: '/account/request', icon: 'new_releases' },
    { label: 'Infos', path: '/account/info', icon: 'account_box' },
    // { label: 'Articles', path: '/account/item', icon: 'shopping_cart' },
  ];

  constructor(
    private userService: UserService,
    private snack: MatSnackBar,
    private sheet: MatBottomSheet,
    private router: Router,
  ) { }

  ngOnInit() {
    this.userService.getCurrentUser()
    .subscribe(user => {
      if (user) {
        console.log(user);
        this.currentUser = user;
      } else {
        this.connexionError();
      }
    }, (err) => this.connexionError());
  }

  openAvatarUpload() {
    const sheetRef = this.sheet.open(AccountAvatarUploadComponent, {
      autoFocus: true,
      closeOnNavigation: true,
      data: this.currentUser,
    });
    sheetRef.afterDismissed().subscribe((user) => {
      if (user) {
        this.currentUser = new User(user);
      }
    });
  }

  connexionError() {
    const snackRef = this.snack.open('Vous avez été déconnecté', 'Reconnexion');
    snackRef.onAction().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

}
