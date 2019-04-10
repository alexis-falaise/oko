import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PostService } from '@core/post.service';
import { forkJoin, timer, Subject } from 'rxjs';
import * as moment from 'moment';

import { UserService } from '@core/user.service';
import { UiService } from '@core/ui.service';

import { User } from '@models/user.model';
import { Proposal } from '@models/post/proposal.model';
import { catchError, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-account-proposal',
  templateUrl: './account-proposal.component.html',
  styleUrls: ['./account-proposal.component.scss']
})
export class AccountProposalComponent implements OnInit {
  @ViewChild('deliverTabs') tabs;
  currentUser: User;
  receivedFromTrip: Array<Proposal> = [];
  receivedFromRequest: Array<Proposal> = [];
  sentAboutTrip: Array<Proposal> = [];
  sentAboutRequest: Array<Proposal> = [];
  toDeliver: Array<Proposal> = [];
  toReceive: Array<Proposal> = [];
  fetchedProposals = new Subject();
  moment = moment;

  constructor(
    private postService: PostService,
    private uiService: UiService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    console.log(this.tabs);
    this.uiService.setLoading(true);
    this.userService.getCurrentUser()
    .subscribe((user: User) => {
      if (user) {
        this.initLists();
        this.fetchLists(user);
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
    timer(2000).pipe(takeUntil(this.fetchedProposals)).subscribe(() => {
      this.uiService.setLoading(false);
      this.setListsEmpty();
    });
  }

  private fetchLists(user: User) {
    forkJoin([
      this.postService.getReceivedProposalsByReceiver(user)
      .pipe(catchError((err, caught) => caught)),
      this.postService.getAllSentProposalsByAuthor(user)
      .pipe(catchError((err, caught) => caught))
    ])
    .pipe(takeUntil(this.fetchedProposals))
    .subscribe(proposals => {
      this.fetchedProposals.next(true);
      this.receivedFromTrip = proposals[0].filter(this.filterFromTrip).sort(this.sortByDate) || [];
      this.receivedFromRequest = proposals[0].filter(this.filterFromRequest).sort(this.sortByDate) || [];
      this.sentAboutTrip = proposals[1].filter(this.filterFromTrip).sort(this.sortByDate) || [];
      this.sentAboutRequest = proposals[1].filter(this.filterFromRequest).sort(this.sortByDate) || [];
      const paidProposals = proposals[0].concat(proposals[1]).filter(proposal => proposal.paid && !proposal.validated);
      /**
       * Proposals to deliver are whether trip proposed by user or request received about a user's trip
       */
      this.toDeliver = paidProposals.filter(proposal => {
        return (proposal.isAuthor(user) && proposal.fromTrip) || (!proposal.isAuthor(user) && proposal.fromRequest);
      });
      /**
       * Proposals to receive are whether requests made by user on a trip or trips received for a request
       */
      this.toReceive = paidProposals.filter(proposal => {
        return (proposal.isAuthor(user) && proposal.fromRequest) || (!proposal.isAuthor(user) && proposal.fromTrip);
      });
      this.uiService.setLoading(false);
    }, (error) => {
      this.uiService.serverError(error);
      this.uiService.setLoading(false);
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
