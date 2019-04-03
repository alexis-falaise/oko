import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { Request } from '@models/post/request.model';

@Component({
  selector: 'app-proposal-request',
  templateUrl: './proposal-request.component.html',
  styleUrls: ['./proposal-request.component.scss']
})
export class ProposalRequestComponent implements OnChanges {
  @Input() request: Request;
  @Output() open = new EventEmitter();

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.request) {
      this.request = changes.request.currentValue;
    }
  }

  openRequest() {
    this.open.emit(this.request);
  }

}
