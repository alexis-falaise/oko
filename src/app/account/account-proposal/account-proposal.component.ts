import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { PostService } from '@core/post.service';
import { forkJoin, timer, Subject } from 'rxjs';
import * as moment from 'moment';

import { UserService } from '@core/user.service';
import { UiService } from '@core/ui.service';

import { User } from '@models/user.model';
import { Proposal } from '@models/post/proposal.model';
import { catchError, takeUntil } from 'rxjs/operators';
import { Socket } from 'ngx-socket-io';
import { ActivatedRoute, Router } from '@angular/router';


class ProposalNotification {
  type: 'create' | 'meeting' | 'bonus' | 'accept' | 'refuse' | 'close' | 'validate' | 'pay';
  author: string;
  proposalId: string;
}
@Component({
  selector: 'app-account-proposal',
  templateUrl: './account-proposal.component.html',
  styleUrls: ['./account-proposal.component.scss']
})
export class AccountProposalComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('deliverTabs', { static: false }) tabs: ElementRef;
  routes = ['deliver', 'upcoming', 'received', 'sent'];
  currentUser: User;
  receivedFromTrip: Array<Proposal> = [];
  receivedFromRequest: Array<Proposal> = [];
  receivedOutdated: Array<Proposal> = [];
  receivedFromTripOutdated: Array<Proposal> = [];
  receivedFromRequestOutdated: Array<Proposal> = [];
  sentFromTrip: Array<Proposal> = [];
  sentFromRequest: Array<Proposal> = [];
  sentOutdated: Array<Proposal> = [];
  sentFromTripOutdated: Array<Proposal> = [];
  sentFromRequestOutdated: Array<Proposal> = [];
  toDeliver: Array<Proposal> = [];
  toReceive: Array<Proposal> = [];
  proposals: Array<Proposal> = [];
  tabIndex = 2;
  fetchedProposals = new Subject();
  moment = moment;

  constructor(
    private postService: PostService,
    private uiService: UiService,
    private userService: UserService,
    private socket: Socket,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.uiService.setLoading(true);
    this.route.data.subscribe((resolverData) => {
      const data = resolverData.data;
      if (data.user) {
        if (this.currentUser) {
          this.removeProposalListeners();
        }
        this.currentUser = data.user;
        this.proposals = data.proposals;
        this.initLists();
        this.filterLists(data.proposals);
        this.setProposalListeners(data.user);
        this.parseCurrentUrl();
      } else {
        this.uiService.setLoading(false);
      }
    });
  }

  ngAfterViewInit() {
  }

  tabChange(e: any) {
    const tabIndex = e;
    const route = this.routes[tabIndex];
    this.router.navigate(['/account', 'proposal', route]);
  }

  private initLists() {
    this.receivedFromTrip = null;
    this.receivedFromRequest = null;
    this.sentFromTrip = null;
    this.sentFromRequest = null;
    timer(2000).pipe(takeUntil(this.fetchedProposals)).subscribe(() => {
      this.uiService.setLoading(false);
      this.setListsEmpty();
    });
  }

  private parseCurrentUrl() {
    const url = this.router.url;
    const routeChilds = url.split('/');
    const currentChild = routeChilds[routeChilds.length - 1];
    this.tabIndex = this.routes.findIndex(route => route === currentChild);
  }

  private filterLists(proposals: Array<Proposal>) {
    const user = this.currentUser;
    this.uiService.setLoading(true);
    this.fetchedProposals.next(true);

    const received = proposals.filter(proposal => !proposal.isAuthor(user)).sort(this.sortByDate);
    const receivedRelevant = received.filter(proposal => !proposal.outdated && !proposal.closed && !proposal.validated);
    this.receivedOutdated = received.filter(proposal => proposal.outdated || proposal.closed || proposal.validated);

    const sent = proposals.filter(proposal => proposal.isAuthor(user)).sort(this.sortByDate);
    const sentRelevant = sent.filter(proposal => !proposal.outdated && !proposal.closed && !proposal.validated);
    this.sentOutdated = sent.filter(proposal => proposal.outdated || proposal.closed || proposal.validated);

    this.receivedFromTrip = receivedRelevant.filter(this.filterFromTrip) || [];
    this.receivedFromRequest = receivedRelevant.filter(this.filterFromRequest) || [];
    this.receivedFromTripOutdated = this.receivedOutdated.filter(this.filterFromTrip) || [];
    this.receivedFromRequestOutdated = this.receivedOutdated.filter(this.filterFromRequest) || [];

    this.sentFromTrip = sentRelevant.filter(this.filterFromTrip) || [];
    this.sentFromRequest = sentRelevant.filter(this.filterFromRequest) || [];
    this.sentFromTripOutdated = this.sentOutdated.filter(this.filterFromTrip) || [];
    this.sentFromRequestOutdated = this.sentOutdated.filter(this.filterFromRequest) || [];
    const paidProposals = proposals.filter(proposal => proposal.paid && !proposal.validated);

    /**
     * Proposals to deliver are whether trips proposed by user or requests received about a user's trip
     */
    this.toDeliver = paidProposals.filter(proposal => {
      return (proposal.isAuthor(user) && proposal.fromTrip) || (!proposal.isAuthor(user) && proposal.fromRequest);
    });
    if (!this.toDeliver.length) {
      this.routes = this.routes.splice(0, 1);
    }
    /**
     * Proposals to receive are whether requests made by user on a trip or trips received for a request
     */
    this.toReceive = paidProposals.filter(proposal => {
      return (proposal.isAuthor(user) && proposal.fromRequest) || (!proposal.isAuthor(user) && proposal.fromTrip);
    });
    if (!this.toReceive.length) {
      this.routes = this.routes.splice(1, 1);
    }
    this.uiService.setLoading(false);
  }

  private refreshProposals(notification: ProposalNotification) {
    this.postService.getProposalById(notification.proposalId)
    .subscribe((proposal) => {
      if (proposal) {
        this.postService.getAllProposalSubPosts(proposal)
        .subscribe((completeProposal) => {
          const formattedProposal = new Proposal(completeProposal);
          if (notification.type === 'create') {
            this.proposals.push(formattedProposal);
          } else {
            const proposalIndex = this.proposals.findIndex(searchedProposal => searchedProposal.id === notification.proposalId);
            this.proposals[proposalIndex] = formattedProposal;
          }
          this.filterLists(this.proposals);
        });
      }
    });
  }

  private setListsEmpty() {
    this.receivedFromTrip = [];
    this.receivedFromRequest = [];
    this.sentFromTrip = [];
    this.sentFromRequest = [];
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

  private setProposalListeners(user: User) {
    this.socket.on(`proposal/${user.id}`, (notification: ProposalNotification) => {
      this.refreshProposals(notification);
    });
  }

  private removeProposalListeners() {
    this.socket.removeListener(`proposal/${this.currentUser.id}`);
  }

  ngOnDestroy() {
    this.removeProposalListeners();
  }

}
