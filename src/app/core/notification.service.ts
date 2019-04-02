import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { MatSnackBar } from '@angular/material';
import { Socket } from 'ngx-socket-io';

import { UserService } from './user.service';

import { User } from '@models/user.model';
import { Router } from '@angular/router';
import { timer } from 'rxjs';

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
    this.socket.on(`message/new/${this.currentUser.id}`, (info) => {
      const title = 'Nouveau message';
      const message = `Nouveau message de ${info.author}`;
      const action = 'Ouvrir';
      const redirect = `/messages/thread/${info.threadId}`;
      this.notify(title, message, action, redirect);
    });
  }

  private removeMessageListeners() {
    this.socket.removeListener(`message/new/${this.currentUser.id}`);
  }

  private notify(title: string, message: string, action: string, redirect?: string) {
    const snack = this.snack.open(message, action, {duration: 4000});
    if (redirect) {
      snack.onAction().subscribe(() => this.router.navigate([redirect]));
    }
  }
}
