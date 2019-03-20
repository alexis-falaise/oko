import { Component, OnInit } from '@angular/core';
import { PostService } from '@core/post.service';
import { forkJoin } from 'rxjs';
import * as moment from 'moment';

import { UserService } from '@core/user.service';
import { UiService } from '@core/ui.service';

import { User } from '@models/user.model';
import { Proposal } from '@models/post/proposal.model';

@Component({
  selector: 'app-account-proposal',
  templateUrl: './account-proposal.component.html',
  styleUrls: ['./account-proposal.component.scss']
})
export class AccountProposalComponent implements OnInit {
  currentUser: User;
  receivedFromTrip: Array<Proposal>;
  receivedFromRequest: Array<Proposal>;
  sentAboutTrip: Array<Proposal>;
  sentAboutRequest: Array<Proposal>;
  moment = moment;

  constructor(
    private postService: PostService,
    private uiService: UiService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.userService.getCurrentUser()
    .subscribe((user: User) => {
      if (user) {
        this.currentUser = user;
        forkJoin([
          this.postService.getReceivedProposalsByReceiver(user),
          this.postService.getAllSentProposalsByAuthor(user)
        ])
        .subscribe(proposals => {
          this.receivedFromTrip = proposals[0].filter(this.filterFromTrip).sort(this.sortByDate);
          this.receivedFromRequest = proposals[0].filter(this.filterFromRequest).sort(this.sortByDate);
          this.sentAboutTrip = proposals[1].filter(this.filterFromTrip).sort(this.sortByDate);
          this.sentAboutRequest = proposals[1].filter(this.filterFromRequest).sort(this.sortByDate);
        });
      }
    }, (error) => this.uiService.serverError(error));
  }

  private filterFromTrip(proposal: Proposal) {
    return proposal.isFromTrip();
  }

  private filterFromRequest(proposal: Proposal) {
    return proposal.isFromRequest();
  }

  private sortByDate(a, b) {
    return moment(a.date).isBefore(b.date) ? 1 : -1;
  }

}
