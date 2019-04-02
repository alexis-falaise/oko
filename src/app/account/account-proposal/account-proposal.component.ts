import { Component, OnInit } from '@angular/core';
import { PostService } from '@core/post.service';
import { forkJoin, of, timer } from 'rxjs';
import * as moment from 'moment';

import { UserService } from '@core/user.service';
import { UiService } from '@core/ui.service';

import { User } from '@models/user.model';
import { Proposal } from '@models/post/proposal.model';
import { MatSnackBar } from '@angular/material';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-account-proposal',
  templateUrl: './account-proposal.component.html',
  styleUrls: ['./account-proposal.component.scss']
})
export class AccountProposalComponent implements OnInit {
  currentUser: User;
  receivedFromTrip: Array<Proposal> = [];
  receivedFromRequest: Array<Proposal> = [];
  sentAboutTrip: Array<Proposal> = [];
  sentAboutRequest: Array<Proposal> = [];
  moment = moment;

  constructor(
    private postService: PostService,
    private uiService: UiService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.uiService.setLoading(true);
    this.userService.getCurrentUser()
    .subscribe((user: User) => {
      if (user) {
        this.initLists();
        forkJoin([
          this.postService.getReceivedProposalsByReceiver(user)
          .pipe(catchError((err, caught) => caught)),
          this.postService.getAllSentProposalsByAuthor(user)
          .pipe(catchError((err, caught) => caught))
        ])
        .subscribe(proposals => {
          this.receivedFromTrip = proposals[0].filter(this.filterFromTrip).sort(this.sortByDate) || [];
          this.receivedFromRequest = proposals[0].filter(this.filterFromRequest).sort(this.sortByDate) || [];
          this.sentAboutTrip = proposals[1].filter(this.filterFromTrip).sort(this.sortByDate) || [];
          this.sentAboutRequest = proposals[1].filter(this.filterFromRequest).sort(this.sortByDate) || [];
          this.uiService.setLoading(false);
        }, (error) => {
          this.uiService.serverError(error);
          this.uiService.setLoading(false);
        });
      } else {
        this.uiService.setLoading(false);
      }
    }, (error) => {
      this.uiService.serverError(error);
      this.uiService.setLoading(false);
    });
  }

  private initLists() {
    this.receivedFromTrip = null;
    this.receivedFromRequest = null;
    this.sentAboutTrip = null;
    this.sentAboutRequest = null;
    timer(2000).subscribe(() => {
      this.uiService.setLoading(false);
      this.setListsEmpty();
    });
  }

  private setListsEmpty() {
    this.receivedFromTrip = [];
    this.receivedFromRequest = [];
    this.sentAboutTrip = [];
    this.sentAboutRequest = [];
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
