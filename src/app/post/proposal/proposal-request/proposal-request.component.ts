import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { Request } from '@models/post/request.model';

@Component({
  selector: 'app-proposal-request',
  templateUrl: './proposal-request.component.html',
  styleUrls: ['./proposal-request.component.scss']
})
export class ProposalRequestComponent implements OnChanges {
  @Input() request: Request;
  @Input() fullDisplay: boolean;
  @Input() own: boolean;
  @Output() open = new EventEmitter();

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.request) {
      this.request = changes.request.currentValue;
    }
    if (changes.fullDisplay) {
      this.fullDisplay = changes.fullDisplay.currentValue;
    }
  }

  openRequest() {
    this.open.emit(this.request);
  }

}
