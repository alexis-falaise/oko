import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit, OnChanges {
  @Input() message;
  showInfo = false;
  avatarSize = 25;

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
