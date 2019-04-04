import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as moment from 'moment';

import { Proposal } from '@models/post/proposal.model';
import { User } from '@models/user.model';

@Component({
  selector: 'app-proposal-list',
  templateUrl: './proposal-list.component.html',
  styleUrls: ['./proposal-list.component.scss']
})
export class ProposalListComponent implements OnChanges {
  @Input() proposalList: Array<Proposal>;
  acceptedProposals: Array<Proposal>;
  pendingProposals: Array<Proposal>;
  refusedProposals: Array<Proposal>;
  irrelevantProposals: Array<Proposal>;
  @Input() aboutTrip: boolean;
  @Input() own: boolean;
  @Input() user: User;
  moment = moment;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.proposalList) {
      this.proposalList = changes.proposalList.currentValue;
      if (this.proposalList) {
        this.acceptedProposals = this.proposalList.filter(proposal => proposal.accepted && !proposal.closed);
        this.pendingProposals = this.proposalList.filter(proposal => {
          return !proposal.accepted && !proposal.refused && !proposal.closed;
        });
        this.refusedProposals = this.proposalList.filter(proposal => proposal.refused && !proposal.closed);
        this.irrelevantProposals = this.proposalList.filter(proposal => {
          return proposal.closed;
        });
      }
    }
    if (changes.aboutTrip) {
      this.aboutTrip = changes.aboutTrip.currentValue;
    }
    if (changes.own) {
      this.own = changes.own.currentValue;
    }
    if (changes.user) {
      this.user = changes.user.currentValue;
    }
  }

}
