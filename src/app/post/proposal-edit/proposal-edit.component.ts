import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { Validators, FormBuilder } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { forkJoin } from 'rxjs';

import { PostService } from '@core/post.service';

import { Proposal } from '@models/post/proposal.model';
import { User } from '@models/user.model';

@Component({
  selector: 'app-proposal-edit',
  templateUrl: './proposal-edit.component.html',
  styleUrls: ['./proposal-edit.component.scss']
})
export class ProposalEditComponent implements OnInit {
  bonus: number;
  min: number;
  max: number;
  airportPickup: boolean;
  proposal: Proposal;
  currentUser: User;
  meeting = this.fb.group({
    address: ['', Validators.required],
    city: ['', Validators.required],
    country: ['', Validators.required],
    zip: [''],
  });

  constructor(
    private postService: PostService,
    private dialogRef: MatDialogRef<ProposalEditComponent>,
    private snack: MatSnackBar,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: {proposal: Proposal, user: User}
  ) { }

  ngOnInit() {
    this.proposal = this.data.proposal;
    this.currentUser = this.data.user;
    this.calculateBoundaries();
    this.bonus = this.proposal.bonus || 0;
    this.airportPickup = this.proposal.airportPickup;
    if (this.proposal.meetingPoint) {
      this.meeting.patchValue(this.proposal.meetingPoint);
    }
  }

  formatLabel(value: number) {
    if (value) {
      return Math.round(value) + '€';
    } else {
      return 0;
    }
  }

  modifyProposal() {
    this.proposal.airportPickup = this.airportPickup;
    this.proposal.meetingPoint = this.meeting.value;
    forkJoin([
      this.postService.updateProposalBonus(this.proposal.id, this.bonus),
      this.postService.updateProposal(this.proposal)
    ]).subscribe(responses => {
      const hasFailed = responses.find(response => !response.status);
      if (hasFailed) {
        this.serverError();
      } else {
        this.snack.open('La proposition a bien été modifiée', 'Top', {duration: 3000});
        this.dialogRef.close(responses[1].data);
      }
    }, (err) => this.serverError(err));
  }

  close() {
    this.dialogRef.close();
  }

  private calculateBoundaries() {
    let referentOffer;
    let originalOffer;
    let currentBonus = this.proposal.bonus;
    const bonusUpdates = this.proposal.updates.filter(update => update.type === 'bonus');
    bonusUpdates.forEach(update => {
      currentBonus = currentBonus - update.bonusDelta;
    });
    originalOffer = currentBonus;
    console.log('Original offer', originalOffer);
    const lastOppositeUpdateIndex = bonusUpdates.findIndex(update => update.author.id !== this.currentUser.id);
    if (lastOppositeUpdateIndex === -1) {
      referentOffer = originalOffer;
    } else {
      let lastOppositeOffer;
      currentBonus = this.proposal.bonus;
      console.log('Current bonus', currentBonus);
      bonusUpdates.forEach((update, index) => {
        if (index >= lastOppositeUpdateIndex && update.type === 'bonus') {
          currentBonus = currentBonus - update.bonusDelta;
          console.log('Current bonus - iteration', update, index, currentBonus);
        }
      });
      lastOppositeOffer = currentBonus;
      console.log('Last opposite offer', lastOppositeOffer);
      referentOffer = lastOppositeOffer;
    }
    this.min = Math.floor(referentOffer * 0.6);
    this.max = Math.ceil(referentOffer * 2);
  }

  private serverError(error?: HttpErrorResponse) {
    if (error) {
      console.log(error);
    }
    const snackRef = this.snack.open('Une erreur s\'est produite', 'Réessayer', {duration: 5000});
    snackRef.onAction().subscribe(() => this.modifyProposal());
  }
}
