import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SwPush } from '@angular/service-worker';
import { Socket } from 'ngx-socket-io';

import { AuthService } from './auth.service';

import { User } from '@models/user.model';
import { environment } from '@env/environment';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  enabled = false;
  messagesNotifications = false;
  currentUser: User;
  readonly VAPID_PUBLIC_KEY = environment.vapidPublicKey;

  constructor(
    private router: Router,
    private snack: MatSnackBar,
    private socket: Socket,
    private swPush: SwPush,
    private authService: AuthService,
  ) {
    this.authService.onUser()
    .subscribe(user => {
      if (this.currentUser) {
        this.removeMessageListeners();
        this.removeProposalListeners();
      }
      if (user) {
        this.currentUser = user;
        this.enableMessageNotifications();
        this.setProposalListeners();
      }
    });
    this.subscribeToPushNotifications();
  }

  subscribeToPushNotifications() {
    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    }).then(sub => console.log('Notification', sub))
    .catch(err => console.log('Subscription error', err));
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

  private setProposalListeners() {
    this.socket.on(`proposal/${this.currentUser.id}`, (info) => {
      let proposalAction;
      switch (info.type) {
        case 'create':
          proposalAction = 'fait ';
          break;
        case 'accept':
          proposalAction = 'accept?? ';
          break;
        case 'refuse':
          proposalAction = 'refus?? ';
          break;
        case 'close':
          proposalAction = 'annul?? ';
          break;
        case 'pay':
          proposalAction = 'regl?? ';
          break;
        case 'meeting':
          proposalAction = 'modifi?? le lieu de rendez-vous d\'';
          break;
        case 'bonus':
          proposalAction = 'modifi?? le bonus d\'';
          break;
        case 'date':
          proposalAction =  'modifi?? la date d\'';
          break;
        default:
          proposalAction = 'modifi?? ';
          break;
      }
      const title = 'Proposition mise ?? jour';
      const message = `${info.author} a ${proposalAction}une proposition`;
      const action = 'Ouvrir';
      const redirect = `post/proposal/${info.proposalId}`;
      this.notify(title, message, action, redirect);
    });
  }

  private removeMessageListeners() {
    this.socket.removeListener(`message/new/${this.currentUser.id}`);
  }

  private removeProposalListeners() {
    this.socket.removeListener(`proposal/${this.currentUser.id}`);
  }

  private notify(title: string, message: string, action: string, redirect?: string) {
    const snack = this.snack.open(message, action, {duration: 4000});
    if (redirect) {
      snack.onAction().subscribe(() => this.router.navigate([redirect]));
    }
  }
}
