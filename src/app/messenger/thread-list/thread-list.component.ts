import { Component, OnInit } from '@angular/core';
import { Moment } from 'moment';
import * as moment from 'moment';

import { MessengerService } from '@core/messenger.service';

import { Thread } from '@models/messenger/thread.model';
import { Message } from '@models/messenger/message.model';
import { UserService } from '@core/user.service';
import { User } from '@models/user.model';
import { Socket } from 'ngx-socket-io';
import { MatDialog } from '@angular/material';
import { ThreadNewComponent } from '../thread-new/thread-new.component';
import { UiService } from '@core/ui.service';


@Component({
  selector: 'app-thread-list',
  templateUrl: './thread-list.component.html',
  styleUrls: ['./thread-list.component.scss']
})
export class ThreadListComponent implements OnInit {
  threads: Array<Thread>;
  contacts: Array<User>;
  currentUser: User;

  constructor(
    private messengerService: MessengerService,
    private userService: UserService,
    private uiService: UiService,
    private dialog: MatDialog,
    private socket: Socket,
  ) { }

  ngOnInit() {
    this.uiService.setLoading(true);
    this.messengerService.onThreads()
    .subscribe(threads => {
      if (this.threads) {
        this.removeThreadsMessagesListeners();
      } 
      this.threads = threads.map(thread => {
        const formattedThread = new Thread(thread, this.currentUser || undefined);
        this.setThreadMessagesListener(formattedThread);
        return formattedThread;
      })
      .sort(this.sortThreads);
      this.uiService.setLoading(false);
    });
    this.messengerService.onContacts()
    .subscribe(contacts => {
      this.removeListeners();
      this.contacts = contacts;
      this.setListeners();
    });
    this.userService.getCurrentUser()
    .subscribe(user => {
      if (user) {
        this.removeNewThreadListener();
        this.currentUser = user;
        this.messengerService.getThreads(user);
        this.messengerService.getContacts(user);
        this.setNewThreadListener();
      }
    });
  }

  newThread() {
    this.dialog.open(ThreadNewComponent, {
      data: {
        user: this.currentUser,
      },
      height: '80vh',
      width: '75vw',
    });
  }

  formatDate(date): string {
    let dateToFormat;
    dateToFormat = moment(date);
    return dateToFormat.isSame(moment(), 'd')
            ? dateToFormat.format('HH:mm')
            : dateToFormat.isSame(moment().subtract(1, 'days'), 'd')
              ? 'Hier'
              : dateToFormat.isAfter(moment().subtract(7, 'days'))
                ? dateToFormat.format('ddd')
                : dateToFormat.format('DD MMMM');
  }

  private setListeners() {
    if (this.contacts) {
      this.contacts.forEach((contact, index) => {
        this.socket.on(`login/${contact._id}`, () => {
          this.contacts[index].isConnected = true;
        });
        this.socket.on(`logout/${contact._id}`, () => {
          this.contacts[index].isConnected = false;
        });
      });
    }
  }

  private removeListeners() {
    if (this.contacts) {
      this.contacts.forEach(contact => {
        this.socket.removeListener(`login/${contact.id}`);
        this.socket.removeListener(`logout/${contact._id}`);
      });
    }
  }

  private setNewThreadListener() {
    this.socket.on(`${this.currentUser.id}/thread/new`, () => {
      this.messengerService.getThreads(this.currentUser);
    });
  }

  private setThreadMessagesListener(thread: Thread) {
    this.socket.on(`message/new/${thread.id}`, (receivedMessage) => {
      const message = new Message(receivedMessage, this.currentUser);
      const threadIndex = this.threads.findIndex(listThread => listThread.id === thread.id);
      this.threads[threadIndex].pushMessage(message);
    });
  }

  private removeThreadsMessagesListeners() {
    if (this.threads) {
      this.threads.forEach(thread => {
        this.socket.removeListener(`message/new/${thread.id}`);
      });
    }
  }

  private removeNewThreadListener() {
    if (this.currentUser) {
      this.socket.removeListener(`${this.currentUser.id}/thread/new`);
    }
  }

  private sortThreads(a: Thread, b: Thread) {
    return moment(a.lastMessage
      ? a.lastMessage.sendDate : a.creationDate)
      .isAfter(b.lastMessage
      ? b.lastMessage.sendDate : b.creationDate) ? -1 : 1;
    }
}
