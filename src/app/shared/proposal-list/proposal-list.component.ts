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
  newActivityProposals: Array<Proposal>;
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
        const relevantProposals = this.proposalList.filter(proposal => !this.isIrrelevant(proposal));
        const seenProposals = relevantProposals.filter(proposal => proposal.seen);
        const newProposals = relevantProposals.filter(proposal => !proposal.seen);
        this.newActivityProposals = newProposals;
        this.acceptedProposals = seenProposals.filter(proposal => proposal.accepted);
        this.pendingProposals = seenProposals.filter(proposal => {
          return !proposal.accepted && !proposal.refused;
        });
        this.refusedProposals = seenProposals.filter(proposal => proposal.refused);
        this.irrelevantProposals = this.proposalList.filter(proposal => {
          return this.isIrrelevant(proposal);
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

  private isIrrelevant(proposal: Proposal): boolean {
    return (proposal.from && proposal.from['urgent'] && moment(proposal.from['urgentDetails'].date).isBefore(moment()))
    || (proposal.to && proposal.to['urgent'] && moment(proposal.to['urgentDetails'].date).isBefore(moment()))
    || (proposal.from && moment(proposal.from['date']).isBefore(moment()))
    || (proposal.to && moment(proposal.to['date']).isBefore(moment()))
    || proposal.closed;
  }

}
