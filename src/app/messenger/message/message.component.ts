import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Message } from '@models/messenger/message.model';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit, OnChanges {
  @Input() message: Message;
  showInfo = false;
  avatarSize = 30;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.message) {
      this.message = changes.message.currentValue;
    }
  }

  ngOnInit() {
  }

  toggleInfo() {
    this.showInfo = !this.showInfo;
  }

}
