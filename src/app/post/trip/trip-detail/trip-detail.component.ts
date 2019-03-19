import { Component, OnInit, ElementRef } from '@angular/core';
import { DateAdapter, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import * as moment from 'moment';

import { PostService } from '@core/post.service';
import { UserService } from '@core/user.service';

import { Item } from '@models/item.model';
import { Proposal } from '@models/post/proposal.model';
import { Request } from '@models/post/request.model';
import { Trip } from '@models/post/trip.model';
import { User } from '@models/user.model';
import { HttpErrorResponse } from '@angular/common/http';
import { UiService } from '@core/ui.service';
import { PexelsService } from '@core/pexels.service';

@Component({
  selector: 'app-trip-detail',
  templateUrl: './trip-detail.component.html',
  styleUrls: ['./trip-detail.component.scss']
})
export class TripDetailComponent implements OnInit {
  trip: Trip = null;
  requests: Array<Request> = null;
  items: Array<Item> = null;
  currentUser: User = null;
  currentRequest: Request = null;
  proposals: Array<Proposal> = null;
  engagement = false;
  own = false;
  moment = moment;
  background: string;
  fadeInfo: boolean;

  constructor(
    private element: ElementRef,
    private router: Router,
    private dateAdapter: DateAdapter<Date>,
    private route: ActivatedRoute,
    private userService: UserService,
    private uiService: UiService,
    private postService: PostService,
    private snack: MatSnackBar,
    private pexels: PexelsService,
  ) { }

  ngOnInit() {
    this.dateAdapter.setLocale('fr');
    this.route.params.subscribe(param => {
      if (param && param.id) {
        this.fetchTrip(param.id);
      }
    });
  }

  fetchTrip(id: string) {
    this.uiService.setLoading(true);
    this.postService.getTripById(id)
    .subscribe(trip => {
      if (trip) {
        this.trip = new Trip(trip);
        this.setBackgroundPicture();
        const requestDraft = this.postService.getRequestDraft();
        if (requestDraft && requestDraft.trip.id === this.trip.id) {
          this.engagement = true;
        }
        this.userService.getCurrentUser()
        .subscribe(user => {
          this.own = user.id === trip.user.id;
          this.currentUser = user;
          if (this.own) {
            this.proposals = [];
            this.fetchProposals();
          } else {
            this.getUserRequests();
          }
         this.uiService.setLoading(false);
        }, (error) => this.serverError(error, id));
      }
    }, (error) => this.serverError(error, id));
  }

  fetchProposals() {
    this.postService.getReceivedProposals(this.trip)
    .subscribe(proposals => {
      this.setProposals(proposals);
    });
  }

  getUserRequests() {
    this.postService.getReceivedProposalsByAuthor(this.trip, this.currentUser)
    .subscribe((proposals: Array<Proposal>) => {
      this.setProposals(proposals);
      this.requests = proposals
      .filter(proposal => !proposal.closed && !proposal.accepted && !proposal.refused)
      .map(proposal => proposal.from) as Array<Request>;
      this.items = this.requests.reduce((acc, request) => acc.concat(request.items), []);
    }, (err) => this.snack.open('Erreur lors du chargement des annonces', 'OK', {duration: 3000}));
  }

  setProposals(proposals: Array<Proposal>) {
    this.proposals = this.own
    ? proposals.filter(proposal => !proposal.closed && !proposal.refused)
    : proposals;
  }

  makeRequest() {
    this.engagement = true;
    const requestEl = document.getElementById('request');
    requestEl.scrollIntoView({behavior: 'smooth', block: 'start'});
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

  onScroll(event) {
    const children = this.element.nativeElement.children[0].children;
    const heightUnit = children[0].clientHeight / 47.5;
    const info = children[1];
    const scrollTop = event.target.scrollTop;
    this.fadeInfo = scrollTop > (info.offsetTop - 20 * heightUnit);
  }

  private setBackgroundPicture() {
    this.pexels.getBackgroundPicture(this.trip.to.airport.country)
    .subscribe(picture => this.background = picture);
  }

  private serverError(error: HttpErrorResponse, id: string) {
    if (error.status !== 401) {
      const snackRef = this.snack.open('Erreur lors du chargement du voyage', 'Réessayer', {duration: 3000});
      snackRef.onAction().subscribe(() => this.fetchTrip(id));
    }
    this.uiService.setLoading(false);
  }

}
