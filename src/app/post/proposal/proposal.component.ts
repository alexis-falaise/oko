import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Router } from '@angular/router';

import { PostService } from '@core/post.service';

import { Proposal } from '@models/post/proposal.model';
import { Trip } from '@models/post/trip.model';
import { Request } from '@models/post/request.model';
import { ServerResponse } from '@models/app/server-response.model';
import { HttpErrorResponse } from '@angular/common/http';
import { UiService } from '@core/ui.service';
import { ProposalEditComponent } from '../proposal-edit/proposal-edit.component';

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.scss']
})
export class ProposalComponent implements OnInit, OnChanges {
  @Input() proposal: Proposal;
  @Input() receiver: boolean;
  fromTrip: boolean;

  constructor(
    private postService: PostService,
    private uiService: UiService,
    private dialog: MatDialog,
    private router: Router,
    private snack: MatSnackBar
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.proposal) {
      this.proposal = changes.proposal.currentValue;
      this.initProposal();
    }
  }

  ngOnInit() {
    this.initProposal();
  }

  initProposal() {
    const origin = this.proposal.from;
    if (origin instanceof Trip) {
      this.fromTrip = true;
    }
  }

  openTrip(trip: Trip) {
    this.router.navigate([`/post/trip/${trip.id}`]);
  }

  openRequest(request: Request) {
    this.router.navigate([`/post/request/${request.id}`]);
  }

  acceptProposal() {
    this.uiService.setLoading(true);
    this.postService.acceptProposal(this.proposal.id)
    .subscribe((response: ServerResponse) => {
      if (response.status) {
        this.snack.open('La proposition a été acceptée', 'Génial', {duration: 3000});
        this.proposal = new Proposal(response.data);
      } else {
        this.serverError(response);
      }
    }, (err) => this.serverError(err));
  }

  closeProposal() {
    this.uiService.setLoading(true);
    this.postService.closeProposal(this.proposal.id)
    .subscribe((response: ServerResponse) => {
      if (response.status) {
        this.snack.open('La proposition a été annulée', 'OK', {duration: 3000});
        this.proposal = new Proposal(response.data);
      } else {
        this.serverError(response);
      }
    }, (err) => this.serverError(err));
  }

  refuseProposal() {
    this.uiService.setLoading(true);
    this.postService.refuseProposal(this.proposal.id)
    .subscribe((response: ServerResponse) => {
      if (response.status) {
        this.snack.open('La proposition a été refusée', 'OK', {duration: 3000});
        this.proposal = new Proposal(response.data);
      } else {
        this.serverError(response);
      }
    }, (err) => this.serverError(err));
  }

  validateProposal() {
    this.uiService.setLoading(true);
    this.postService.validateProposal(this.proposal.id)
    .subscribe((response: ServerResponse) => {
      if (response.status) {
        this.snack.open('La réception a bien été confirmée', 'Parfait', {duration: 3000});
        this.proposal = new Proposal(response.data);
      } else {
        this.serverError(response);
      }
    }, (err) => this.serverError(err));
  }

  modifyProposal() {
    const dialogRef = this.dialog.open(ProposalEditComponent, {
      height: '60vh',
      width: '80vw',
      data: this.proposal,
    });
  }

  private serverError(error: HttpErrorResponse | ServerResponse) {
    this.uiService.setLoading(false);
    const snackRef = this.snack.open(`Une erreur est survenue (${error instanceof HttpErrorResponse ? error.status : error.message})`,
    undefined, {duration: 5000});
  }


}
