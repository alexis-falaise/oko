import { Component, Input, OnInit } from '@angular/core';

import { Thread } from '@models/messenger/thread.model';
import { MessengerService } from '@core/messenger.service';

@Component({
  selector: 'app-thread-header',
  templateUrl: './thread-header.component.html',
  styleUrls: ['./thread-header.component.scss']
})
export class ThreadHeaderComponent implements OnInit {
  @Input() thread: Thread;

  constructor(private messengerService: MessengerService) { }

  ngOnInit() {
    this.messengerService.onThread().subscribe(thread => this.thread = thread);
  }

}
