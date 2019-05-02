import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Subject } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import * as moment from 'moment';

import { MessengerService } from '@core/messenger.service';
import { UserService } from '@core/user.service';
import { UiService } from '@core/ui.service';

import { ThreadNewComponent } from '../thread-new/thread-new.component';
import { ThreadRemoveComponent } from '../thread-remove/thread-remove.component';

import { Thread } from '@models/messenger/thread.model';
import { Message } from '@models/messenger/message.model';
import { User } from '@models/user.model';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-thread-list',
  templateUrl: './thread-list.component.html',
  styleUrls: ['./thread-list.component.scss']
})
export class ThreadListComponent implements OnInit, OnDestroy {
  threads: Array<Thread>;
  threadPanels: Array<boolean>;
  contacts: Array<User>;
  currentUser: User;
  ngUnsubscribe = new Subject();

  constructor(
    private messengerService: MessengerService,
    private userService: UserService,
    private uiService: UiService,
    private snack: MatSnackBar,
    private dialog: MatDialog,
    private socket: Socket,
  ) { }

  ngOnInit() {
    this.subscribeThreads();
    this.subscribeContacts();
    this.userService.getCurrentUser()
    .subscribe(user => {
      if (user) {
        this.removeNewThreadListener();
        this.currentUser = user;
        this.uiService.setLoading(true);
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

  displayPanel(index: number) {
    this.threadPanels = this.threadPanels.map(() => false);
    this.threadPanels[index] = true;
  }

  hidePanel(index: number) {
    this.threadPanels[index] = false;
  }

  removeThread(thread: Thread) {
    this.dialog.open(ThreadRemoveComponent, {
      data: thread,
      height: '60vh',
      width: '75vw',
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private subscribeThreads() {
    this.messengerService.onThreads()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(threads => {
      if (this.threads) {
        this.removeThreadsMessagesListeners();
      }
      if (threads) {
        this.setThreads(threads);
      }
      this.uiService.setLoading(false);
    });
  }

  private setThreads(threads: Array<Thread>) {
    this.threads = threads.sort(this.sortThreads).map(thread => {
      this.setThreadMessagesListener(thread);
      return thread;
    });
    this.threadPanels = this.threads.map(() => false);
  }

  private subscribeContacts() {
    this.messengerService.onContacts()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(contacts => {
      this.removeListeners();
      this.contacts = contacts;
      this.setListeners();
    });
  }

  private setListeners() {
    if (this.contacts) {
      this.contacts.forEach((contact, index) => {
        this.socket.on(`login/${contact._id}`, (id) => {
          const contactIndex = this.contacts.findIndex(searchedContact => searchedContact._id === id);
          this.contacts[contactIndex].isConnected = true;
        });
        this.socket.on(`logout/${contact._id}`, (id) => {
          const contactIndex = this.contacts.findIndex(searchedContact => searchedContact._id === id);
          this.contacts[contactIndex].isConnected = false;
        });
        this.socket.on(`disconnected/${contact._id}`, (id) => {
          const contactIndex = this.contacts.findIndex(searchedContact => searchedContact._id === id);
          this.contacts[contactIndex].isConnected = false;
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
      this.threads = this.threads.sort(this.sortThreads);
    });
  }

  private removeThreadMessagesListener(thread: Thread) {
    this.socket.removeListener(`message/new/${thread.id}`);
  }

  private removeThreadsMessagesListeners() {
    if (this.threads) {
      this.threads.forEach(thread => {
        this.removeThreadMessagesListener(thread);
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
