import { Component, OnInit, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { DateAdapter } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, timer } from 'rxjs';
import * as moment from 'moment';

import { HistoryService } from '@core/history.service';
import { MessengerService } from '@core/messenger.service';
import { PostService } from '@core/post.service';
import { UiService } from '@core/ui.service';

import { Item } from '@models/item.model';
import { Proposal } from '@models/post/proposal.model';
import { Request } from '@models/post/request.model';
import { Trip } from '@models/post/trip.model';
import { User } from '@models/user.model';

@Component({
  selector: 'app-trip-detail',
  templateUrl: './trip-detail.component.html',
  styleUrls: ['./trip-detail.component.scss']
})
export class TripDetailComponent implements OnInit {
  trip: Trip = null;
  requests: Array<Request> = [];
  items: Array<Item> = null;
  currentUser: User = null;
  currentRequest: Request = null;
  proposals: Array<Proposal> = null;
  engagement = false;
  own = false;
  moment = moment;
  background: string;
  fadeInfo: boolean;
  ordering: boolean;

  constructor(
    private element: ElementRef,
    private router: Router,
    private dateAdapter: DateAdapter<Date>,
    private route: ActivatedRoute,
    private location: Location,
    private historyService: HistoryService,
    private messengerService: MessengerService,
    private postService: PostService,
    private uiService: UiService,
    private snack: MatSnackBar,
  ) { }

  ngOnInit() {
    this.dateAdapter.setLocale('fr');
    this.route.url.subscribe(segments => {
      this.ordering = !!segments.find(segment => segment.path === 'order');
      if (this.ordering) {
        this.makeRequest();
      } else {
        this.engagement = false;
      }
    });
    this.route.data.subscribe((data) => {
      this.currentUser = new User(data.tripInfo.user);
      this.trip = new Trip(data.tripInfo.trip);
      this.background = data.tripInfo.background;
      this.init();
    });
  }

  init() {
    this.own = this.currentUser.id === this.trip.user.id;
    if (this.own) {
      this.proposals = [];
      this.fetchProposals();
    } else {
      this.getUserRequests();
    }
    const requestDraft = this.postService.getRequestDraft();
    if (requestDraft && requestDraft.trip.id === this.trip.id) {
      this.engagement = true;
    }
  }

  fetchProposals() {
    this.postService.getReceivedProposals(this.trip)
    .subscribe(proposals => {
      this.setProposals(proposals);
      if (this.ordering) {
        this.scrollToRequest();
      }
    });
  }

  getUserRequests() {
    this.postService.getReceivedProposalsByAuthor(this.trip, this.currentUser)
    .subscribe((proposals: Array<Proposal>) => {
      this.setProposals(proposals);
      this.requests = proposals
      .filter(proposal => !proposal.closed && !proposal.accepted && !proposal.refused && !proposal.outdated)
      .map(proposal => proposal.from) as Array<Request>;
      this.items = this.requests.reduce((acc, request) => acc.concat(request.items), []);
      if (this.ordering) {
        this.scrollToRequest();
      }
    }, (err) => this.snack.open('Erreur lors du chargement des annonces', 'OK', {duration: 3000}));
  }

  setProposals(proposals: Array<Proposal>) {
    this.proposals = proposals.filter(proposal => !proposal.closed && !proposal.refused && !proposal.outdated);
  }

  makeRequest() {
    if (!this.ordering) {
      const url = this.router.createUrlTree(['order'], { relativeTo: this.route });
      const serializedUrl = this.router.serializeUrl(url);
      this.location.go(serializedUrl);
      this.historyService.add(serializedUrl);
    }
    this.engagement = true;
    this.scrollToRequest();
  }

  scrollToRequest() {
    timer(250).subscribe(() => {
      const requestEl = document.getElementById('request');
      requestEl.scrollIntoView({behavior: 'smooth', block: 'center'});
    });
  }

  openRequest() {
    this.router.navigate([`/account/request`]);
  }

  closeRequest() {
    this.uiService.setLoading(true);
    forkJoin(this.requests.map((request, index) => {
      const relatedProposal = this.proposals.find(proposal => proposal.from.id === request.id);
      return this.postService.closeProposal(relatedProposal.id);
    })).subscribe((responses) => {
      this.getUserRequests();
      const hasFailed = responses.find(response => !response.status);
      if (hasFailed) {
        const snackRef = this.snack.open('Une ou plusieurs demandes n\'ont pas été annulées', 'Réessayer', {duration: 5000});
        snackRef.onAction().subscribe(() => this.closeRequest());
      } else {
        this.snack.open('Les propositions ont été annulées', 'OK', {duration: 2500});
      }
      this.uiService.setLoading(false);
    });
  }

  contact() {
    this.messengerService.getContactThread(this.trip.user, this.currentUser);
  }

  onScroll(event) {
    const children = this.element.nativeElement.children[0].children;
    const heightUnit = children[0].clientHeight / 47.5;
    const info = children[1];
    const scrollTop = event.target.scrollTop;
    this.fadeInfo = scrollTop > (info.offsetTop - 20 * heightUnit);
  }

}
