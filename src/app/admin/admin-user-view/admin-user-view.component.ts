import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AdminService } from '../admin.service';
import { MessengerService } from '@core/messenger.service';

import { User } from '@models/user.model';
import { UserService } from '@core/user.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-admin-user-view',
  templateUrl: './admin-user-view.component.html',
  styleUrls: ['./admin-user-view.component.scss']
})
export class AdminUserViewComponent implements OnInit, OnDestroy {
  user: User;

  constructor(
    private adminService: AdminService,
    private snack: MatSnackBar,
    private messengerService: MessengerService,
    private userService: UserService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.user = data.user;
    });
  }

  contact() {
    this.userService.getCurrentUser()
    .subscribe(user => {
      if (user.id !== this.user.id) {
        this.messengerService.getContactThread(user, this.user);
      } else {
        this.snack.open('Vous êtes actuellement en relation', 'Ah oui', {duration: 3000});
      }
    });
  }

  deleteUser() {
    this.adminService.deleteUser(this.user);
  }

  ngOnDestroy(): void {
    this.adminService.resetCurrentUser();
  }

}
