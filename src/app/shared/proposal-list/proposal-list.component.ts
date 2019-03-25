import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as moment from 'moment';

import { Proposal } from '@models/post/proposal.model';

@Component({
  selector: 'app-proposal-list',
  templateUrl: './proposal-list.component.html',
  styleUrls: ['./proposal-list.component.scss']
})
export class ProposalListComponent implements OnChanges {
  @Input() proposalList: Array<Proposal>;
  @Input() aboutTrip: boolean;
  @Input() own: boolean;
  moment = moment;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.proposalList) {
      this.proposalList = changes.proposalList.currentValue;
    }
    if (changes.aboutTrip) {
      this.aboutTrip = changes.aboutTrip.currentValue;
    }
    if (changes.own) {
      this.own = changes.own.currentValue;
    }
  }

}
