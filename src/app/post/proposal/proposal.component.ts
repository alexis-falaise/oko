import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

import { PostService } from '@core/post.service';
import { UiService } from '@core/ui.service';
import { UserService } from '@core/user.service';

import { ProposalEditComponent } from '../proposal-edit/proposal-edit.component';

import { Proposal } from '@models/post/proposal.model';
import { Request } from '@models/post/request.model';
import { ServerResponse } from '@models/app/server-response.model';
import { Trip } from '@models/post/trip.model';
import { User } from '@models/user.model';

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.scss']
})
export class ProposalComponent implements OnInit, OnChanges {
  @Input() proposal: Proposal;
  @Input() receiver: boolean;
  currentUser: User;
  fromTrip: boolean;
  standalone: boolean;
  moment = moment;

  constructor(
    private postService: PostService,
    private userService: UserService,
    private uiService: UiService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private snack: MatSnackBar
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.proposal) {
      this.proposal = changes.proposal.currentValue;
      this.initProposal();
    }
  }

  ngOnInit() {
    this.userService.getCurrentUser()
    .subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.route.url.subscribe(segments => {
          this.standalone = !!segments.find(segment => segment.path === 'proposal');
          if (this.standalone) {
            this.getStandaloneProposal();
          } else {
            this.initProposal();
          }
        });
      }
    });
  }

  initProposal() {
    console.log(this.proposal);
    if (this.proposal) {
      this.fromTrip = this.proposal.isFromTrip();
      if (this.proposal.receiver && this.currentUser) {
        this.receiver = this.proposal.receiver.id === this.currentUser.id;
      }
      if (this.currentUser) {
        this.proposal.isAuthor(this.currentUser);
      }
    }
  }

  getStandaloneProposal() {
    this.route.params.subscribe(param => {
      if (param && param.id) {
        this.postService.getProposalById(param.id)
        .subscribe(proposal => {
          this.postService.getAllProposalSubPosts(proposal)
          .subscribe(filledProposal => {
            this.proposal = new Proposal(filledProposal);
            this.initProposal();
          });
        });
      }
    });
  }

  openTrip(trip: Trip) {
    this.router.navigate([`/post/trip/${trip._id}`]);
  }

  openRequest(request: Request) {
    this.router.navigate([`/post/request/${request._id}`]);
  }

  acceptProposal() {
    this.uiService.setLoading(true);
    this.postService.acceptProposal(this.proposal.id)
    .subscribe((response: ServerResponse) => {
      if (response.status) {
        this.snack.open('La proposition a été acceptée', 'Génial', {duration: 3000});
        this.proposal.accepted = response.data.accepted;
      } else {
        this.serverError(response);
      }
    this.uiService.setLoading(false);
    }, (err) => this.serverError(err));
  }

  closeProposal() {
    this.uiService.setLoading(true);
    this.postService.closeProposal(this.proposal.id)
    .subscribe((response: ServerResponse) => {
      if (response.status) {
        this.snack.open('La proposition a été annulée', 'OK', {duration: 3000});
        this.proposal.closed = response.data.closed;
      } else {
        this.serverError(response);
      }
    this.uiService.setLoading(false);
    }, (err) => this.serverError(err));
  }

  refuseProposal() {
    this.uiService.setLoading(true);
    this.postService.refuseProposal(this.proposal.id)
    .subscribe((response: ServerResponse) => {
      if (response.status) {
        this.snack.open('La proposition a été refusée', 'OK', {duration: 3000});
        this.proposal.refused = response.data.refused;
      } else {
        this.serverError(response);
      }
    this.uiService.setLoading(false);
    }, (err) => this.serverError(err));
  }

  validateProposal() {
    this.uiService.setLoading(true);
    this.postService.validateProposal(this.proposal.id)
    .subscribe((response: ServerResponse) => {
      if (response.status) {
        this.snack.open('La réception a bien été confirmée', 'Parfait', {duration: 3000});
        this.proposal.validated = response.data.validated;
      } else {
        this.serverError(response);
      }
    this.uiService.setLoading(false);
    }, (err) => this.serverError(err));
  }

  modifyProposal() {
    const dialogRef = this.dialog.open(ProposalEditComponent, {
      height: '85vh',
      width: '80vw',
      data: this.proposal,
    });
    dialogRef.afterClosed().subscribe(proposal => {
      if (proposal) {
        this.proposal.bonus = proposal.bonus;
        this.proposal.updates = proposal.updates;
        this.proposal = new Proposal(this.proposal);
      }
    });
  }

  private serverError(error: HttpErrorResponse | ServerResponse) {
    this.uiService.setLoading(false);
    const snackRef = this.snack.open(`Une erreur est survenue (${error instanceof HttpErrorResponse ? error.status : error.message})`,
    undefined, {duration: 5000});
  }


}
