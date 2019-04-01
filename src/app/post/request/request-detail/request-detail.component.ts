import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, DateAdapter } from '@angular/material';
import * as moment from 'moment';

import { PostService } from '@core/post.service';

import { Request } from '@models/post/request.model';
import { Trip } from '@models/post/trip.model';
import { UiService } from '@core/ui.service';
import { UserService } from '@core/user.service';
import { User } from '@models/user.model';
import { Proposal } from '@models/post/proposal.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-request-detail',
  templateUrl: './request-detail.component.html',
  styleUrls: ['./request-detail.component.scss']
})
export class RequestDetailComponent implements OnInit {
  request: Request = new Request();
  currentUser: User;
  receivedProposals: Array<Proposal>;
  sentProposals: Array<Proposal>;
  currentUserProposals: Array<Proposal>;
  displayedProposals: Array<Proposal> = [];
  moment = moment;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private postService: PostService,
    private uiService: UiService,
    private snack: MatSnackBar,
    private dateAdapter: DateAdapter<any>
  ) { }

  ngOnInit() {
    this.dateAdapter.setLocale('fr');
    this.uiService.setLoading(true);
    this.route.params.subscribe(param => {
      if (param && param.id) {
        this.postService.getRequestById(param.id)
        .subscribe((request) => {
          if (request) {
            this.userService.getCurrentUser()
            .subscribe(user => {
              if (user) {
                this.currentUser = user;
                this.getProposals(request);
              }
              this.setRequest(request);
            }, (err) => this.setRequest(request));
          }
        }, (err) => this.serverError(err));
      } else {
        this.uiService.setLoading(false);
        this.router.navigate(['/404']);
      }
    });
  }

  setRequest(request: Request) {
    this.request = new Request(request);
    if (this.currentUser) {
      this.request.isOwn(this.currentUser);
    }
    this.uiService.setLoading(false);
  }

  validate() {
    this.uiService.setLoading(true);
    this.postService.validateRequest(this.request.id)
    .subscribe((response) => {
      if (response.status) {
        this.snack.open('La demande a été validée', 'OK', {duration: 3000});
        this.setRequest(response.data);
      }
    });
  }

  cancel() {
    this.uiService.setLoading(true);
    this.postService.closeRequest(this.request.id)
    .subscribe((response) => {
      if (response.status) {
        this.snack.open('La demande a été annulée', 'OK', {duration: 3000});
        this.setRequest(response.data);
      }
    });
  }

  openTrip(trip?: Trip) {
    this.router.navigate([`/post/trip/${trip ? trip.id : this.request.trip.id}`]);
  }

  proposeTrip() {
    this.router.navigate([`/post/trip/propose/${this.request.id}`]);
  }

  getProposals(request: Request) {
    this.uiService.setLoading(true);
    if (this.request.own) {
      this.getReceivedProposals(request);
      this.getSentProposals(request);
    } else {
      this.getReceivedProposalsByAuthor(request);
    }
  }

  /**
   * Display the proposals received for this request
   * @param request : Current request
   */
  getReceivedProposals(request: Request) {
    this.postService.getReceivedProposals(request)
    .subscribe((proposals: Array<Proposal>) => {
      this.receivedProposals = proposals.map(proposal => {
        proposal.isAuthor(this.currentUser);
        this.displayedProposals.push(proposal);
        return proposal;
      });
      this.uiService.setLoading(false);
    }, (err: HttpErrorResponse) => this.serverError(err));
  }

  /**
   * Display the proposals sent from this request
   * @param request : Current request
   */
  getSentProposals(request: Request) {
    this.postService.getSentProposals(request)
    .subscribe((proposals: Array<Proposal>) => {
      this.sentProposals = proposals.map(proposal => {
        proposal.isAuthor(this.currentUser);
        this.displayedProposals.push(proposal);
        return proposal;
      });
    }, (err: HttpErrorResponse) => this.serverError(err));
  }

  /**
   * Get received proposals concerning this request, if the current user is author of the proposal
   * @param request : Current request
   */
  getReceivedProposalsByAuthor(request: Request) {
    this.postService.getReceivedProposalsByAuthor(request, this.currentUser)
    .subscribe((proposals: Array<Proposal>) => {
      this.currentUserProposals = proposals.map(proposal => {
        proposal.isAuthor(this.currentUser);
        this.displayedProposals.push(proposal);
        return proposal;
      });
      this.uiService.setLoading(false);
    }, (err: HttpErrorResponse) => this.serverError(err));
  }

  private serverError(error: HttpErrorResponse) {
    this.uiService.setLoading(false);
    this.snack.open(`Erreur lors de la récupération des propositions (${error.message})`, undefined, {duration: 2500});
  }

}
