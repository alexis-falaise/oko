import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { takeUntil } from 'rxjs/operators';
import { timer, Subject } from 'rxjs';

import { MessengerService } from '@core/messenger.service';
import { UserService } from '@core/user.service';
import { UiService } from '@core/ui.service';

import { Thread } from '@models/messenger/thread.model';
import { User } from '@models/user.model';
import { Message } from '@models/messenger/message.model';
import { HistoryService } from '@core/history.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss']
})
export class ThreadComponent implements OnInit, OnDestroy {
  thread: Thread;
  message = new Message({});
  ngUnsubscribe = new Subject();
  currentUser: User;
  inputRows = 1;
  uiCoolDown = 150;
  constructor(
    @Inject(DOCUMENT) public document: Document,
    private route: ActivatedRoute,
    private historyService: HistoryService,
    private messengerService: MessengerService,
    private userService: UserService,
    private uiService: UiService,
    private snack: MatSnackBar,
    private socket: Socket,
  ) { }

  ngOnInit() {
    this.uiService.setMainLoading(true);
    this.userService.getCurrentUser()
    .subscribe(user => {
      this.currentUser = user;
      this.getThreadFromParams();
      this.subscribeThread();
    });
  }

  sendMessage() {
    if (this.message.content.charAt(0) === '\n') {
      this.message.content = this.message.content.slice(1);
    }
    this.message.send();
    this.messengerService.createMessage(this.thread, this.message)
    .subscribe(response => console.log(response));
    this.message = new Message({content: ''});
  }

  captureKey(event) {
    // Shift + Enter
    if (event.shiftKey && event.keyCode === 13) {
      this.inputRows = 2;
    }
    if (!event.shiftKey && event.keyCode === 13) {
      this.inputRows = 1;
      this.sendMessage();
    }
  }

  scrollDown() {
    if (this.thread && this.thread.messages) {
      const messageId = `message-${this.thread.messages.length - 1}`;
      const container = this.document.getElementById('content');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }

  private getThreadFromParams() {
    this.route.params.subscribe(params => {
      if (params && params.id) {
        const threadId = params.id;
        this.messengerService.getThread(threadId);
      } else {
        this.snack.open('Cette discussion n\'existe pas...', 'Mince');
        this.historyService.back();
      }
    });
  }

  private subscribeThread() {
    this.messengerService.onThread()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(thread => {
      if (thread) {
        this.removeThreadListeners();
        this.thread = new Thread(thread, this.currentUser);
        this.setThreadListeners();
        timer(this.uiCoolDown).subscribe(() => this.scrollDown());
        this.uiService.setMainLoading(false);
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
      const receivedMessage = new Message(message, this.currentUser);
      this.thread.messages.push(new Message(receivedMessage));
      console.log('New message', receivedMessage);
      if (!receivedMessage.isAuthor(this.currentUser) && !receivedMessage.seen) {
        const seenMessage = receivedMessage.markAsSeen();
        console.log('Emit client sight', seenMessage);
        this.socket.emit(`message/clientSight/${this.thread.id}`, seenMessage);
      }
      timer(this.uiCoolDown).subscribe(() => this.scrollDown());
    });
    this.socket.on(`message/serverSight/${this.thread.id}`, (message) => {
      console.log('Server sight received', message);
      const messageIndex = this.thread.messages.findIndex(threadMessage => threadMessage._id === message._id);
      this.thread[messageIndex] = message;
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.messengerService.resetThread();
    this.removeThreadListeners();
  }

}
