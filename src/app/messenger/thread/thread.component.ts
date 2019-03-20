import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MessengerService } from '@core/messenger.service';
import { UserService } from '@core/user.service';

import { Thread } from '@models/messenger/thread.model';
import { User } from '@models/user.model';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss']
})
export class ThreadComponent implements OnInit {
  thread: Thread;
  currentUser: User;
  constructor(
    private route: ActivatedRoute,
    private messengerService: MessengerService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.userService.getCurrentUser()
    .subscribe(user => {
      this.currentUser = user;
      this.messengerService.onThread()
      .subscribe(thread => {
        if (thread) {
          console.log('Thread', thread);
          this.thread = new Thread(thread, user);
        }
      });
    });
  }

}
