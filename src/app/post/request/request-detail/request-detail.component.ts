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
  receivedProposals: Array<Proposal>;
  currentUserProposals: Array<Proposal>;
  displayedProposals: Array<Proposal>;
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
                this.setRequest(request, user);
                this.getProposals(request, user);
              } else {
                this.setRequest(request);
              }
            }, (err) => this.setRequest(request));
          }
        });
      }
    });
  }

  setRequest(request: Request, user?: User) {
    this.request = new Request(request);
    if (user) {
      this.request.isOwn(user);
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

  getProposals(request: Request, user: User) {
    this.uiService.setLoading(true);
    if (this.request.own) {
      this.postService.getReceivedProposals(request)
      .subscribe((proposals: Array<Proposal>) => {
        this.receivedProposals = proposals;
        this.displayedProposals = proposals;
        this.uiService.setLoading(false);
      }, (err: HttpErrorResponse) => this.serverError(err));
    } else {
      this.postService.getReceivedProposalsByAuthor(request, user)
      .subscribe((proposals: Array<Proposal>) => {
        this.currentUserProposals = proposals;
        this.displayedProposals = proposals.map(proposal => {
          proposal.isAuthor(user);
          return proposal;
        });
        this.uiService.setLoading(false);
      }, (err: HttpErrorResponse) => this.serverError(err));
    }
  }

  private serverError(error: HttpErrorResponse) {
    this.uiService.setLoading(false);
    this.snack.open(`Erreur lors de la récupération des propositions (${error.message})`, undefined, {duration: 2500});
  }

}
