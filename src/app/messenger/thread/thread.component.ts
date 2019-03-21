import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MessengerService } from '@core/messenger.service';
import { UserService } from '@core/user.service';

import { Thread } from '@models/messenger/thread.model';
import { User } from '@models/user.model';
import { Message } from '@models/messenger/message.model';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss']
})
export class ThreadComponent implements OnInit {
  thread: Thread;
  message = new Message({});
  currentUser: User;
  constructor(
    private route: ActivatedRoute,
    private messengerService: MessengerService,
    private userService: UserService,
    private socket: Socket,
  ) { }

  ngOnInit() {
    this.userService.getCurrentUser()
    .subscribe(user => {
      this.currentUser = user;
      this.getThreadFromParams();
      this.subscribeThread();
    });
  }

  sendMessage() {
    this.message.send();
    console.log('Sending', this.message);
    this.messengerService.createMessage(this.thread, this.message);
    this.message = new Message({});
  }

  private getThreadFromParams() {
    this.route.params.subscribe(params => {
      if (params && params.id) {
        const threadId = params.id;
        this.messengerService.getThread(threadId);
      }
    });
  }

  private subscribeThread() {
    this.messengerService.onThread()
    .subscribe(thread => {
      if (thread) {
        this.removeThreadListeners();
        this.thread = new Thread(thread, this.currentUser);
        this.setThreadListeners();
      }
    });
  }

  private removeThreadListeners() {
    if (this.thread) {
      this.socket.removeListener(`message/new/${this.thread.id}`);
    }
  }

  private setThreadListeners() {
    this.socket.on(`message/new/${this.thread.id}`, (message) => {
      console.log('Got a message', message);
      this.thread.messages.push(message);
    });
  }

}
