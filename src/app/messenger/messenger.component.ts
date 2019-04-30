import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { Thread } from '@models/messenger/thread.model';
import { MessengerService } from '@core/messenger.service';

@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.scss']
})
export class MessengerComponent implements OnInit, OnDestroy {
  threadDisplay: boolean;
  thread: Thread;
  title: string;

  constructor(
    private router: Router,
    private messengerService: MessengerService,
  ) { }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.threadDisplay = !!this.router.url.includes('thread/');
      }
    });
  }

  ngOnDestroy() {
    this.messengerService.resetThreads();
  }

}
