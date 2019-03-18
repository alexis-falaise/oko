import { Component, OnInit } from '@angular/core';

import { MessengerService } from '@core/messenger.service';

import { Thread } from '@models/messenger/thread.model';
import { UserService } from '@core/user.service';
import { User } from '@models/user.model';

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
  ) { }

  ngOnInit() {
    this.messengerService.onThreads()
    .subscribe(threads => this.threads = threads.map(thread => new Thread(thread, this.currentUser || undefined)));
    this.messengerService.onContacts()
    .subscribe(contacts => {
      console.log(contacts);
      this.contacts = contacts;
    });
    this.userService.getCurrentUser()
    .subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.messengerService.getThreads(user);
        this.messengerService.getContacts(user);
      }
    });
  }

  getContactThread(contact: User) {
    this.messengerService.getContactThread(this.currentUser, contact);
  }

}
