import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

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
  sessionsSortAscending = false;
  moment = moment;

  constructor(
    private adminService: AdminService,
    private snack: MatSnackBar,
    private messengerService: MessengerService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.user = data.user;
      this.sortSessions();
    });
  }

  sortSessions() {
    this.user.sessions = this.user.sessions.sort((a, b) => {
      const before = moment(a.start).isBefore(moment(b.start));
      if (this.sessionsSortAscending) {
        return before ? 1 : -1;
      } else {
        return before ? -1 : 1;
      }
    });
    this.sessionsSortAscending = !this.sessionsSortAscending;
  }

  contact() {
    this.messengerService.getContactThread(this.user);
  }

  setAdmin(change) {
    const adminStatus = change.checked;
    this.adminService.setUserAsAdmin(this.user.id, adminStatus)
    .subscribe((receivedUser: User) => {
      this.updateUser(receivedUser);
      this.snack.open(`Privilège d'administateur ${adminStatus ? 'accordé' : 'retiré'} à ${this.user.firstname}`,
      'OK', {duration: 4500});
    }, () => this.updateUser(this.user));
  }

  deleteUser() {
    const snackRef = this.snack.open('Êtes-vous sur ?', 'Oui chef', {duration: 10000});
    snackRef.onAction().subscribe(() => this.adminService.deleteUser(this.user));
  }

  ngOnDestroy(): void {
    this.adminService.resetCurrentUser();
  }

  private updateUser(user: User) {
    this.user = user;
  }

}
