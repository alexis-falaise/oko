import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as moment from 'moment';

import { Proposal } from '@models/post/proposal.model';

@Component({
  selector: 'app-proposal-list-item',
  templateUrl: './proposal-list-item.component.html',
  styleUrls: ['./proposal-list-item.component.scss']
})
export class ProposalListItemComponent implements OnChanges {
  @Input() proposal: Proposal;
  @Input() aboutTrip: boolean;
  @Input() own: boolean;
  moment = moment;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.proposal) {
      this.proposal = changes.proposal.currentValue;
    }
    if (changes.aboutTrip) {
      this.aboutTrip = changes.aboutTrip.currentValue;
    }
    if (changes.own) {
      this.own = changes.own.currentValue;
    }
  }

}
