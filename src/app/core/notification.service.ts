import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { MatSnackBar } from '@angular/material';
import { Socket } from 'ngx-socket-io';

import { UserService } from './user.service';

import { User } from '@models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  enabled = false;
  messagesNotifications = false;
  currentUser: User;

  constructor(
    private router: Router,
    private snack: MatSnackBar,
    private socket: Socket,
    private userService: UserService,
  ) {
    this.userService.getCurrentUser()
    .subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.enableMessageNotifications();
      }
    });
  }

  enableMessageNotifications() {
    if (this.currentUser && !this.messagesNotifications) {
      this.setMessageListeners();
      this.messagesNotifications = true;
    }
  }

  disableMessageNotifications() {
    if (this.currentUser && this.messagesNotifications) {
      this.removeMessageListeners();
      this.messagesNotifications = false;
    }
  }

  private setMessageListeners() {
    console.log('Setting message listeners');
    this.socket.on(`message/new/${this.currentUser.id}`, (info) => {
      const snack = this.snack.open(`Nouveau message de ${info.author}`, 'Ouvrir', {duration: 4000});
      snack.onAction().subscribe(() => this.router.navigate(['/messages', 'thread', info.threadId]));
    });
  }

  private removeMessageListeners() {
    this.socket.removeListener(`message/new/${this.currentUser.id}`);
  }
}
