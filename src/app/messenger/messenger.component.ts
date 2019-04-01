import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { MessengerService } from '@core/messenger.service';

import { Thread } from '@models/messenger/thread.model';
import { UserService } from '@core/user.service';

@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.scss']
})
export class MessengerComponent implements OnInit {
  threadDisplay: boolean;
  thread: Thread;
  title: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.url.subscribe(segments => {
      this.threadDisplay = !!this.router.url.includes('thread');
    });
  }

}
