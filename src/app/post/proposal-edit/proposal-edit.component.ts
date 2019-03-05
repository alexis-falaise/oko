import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';

import { PostService } from '@core/post.service';

import { Proposal } from '@models/post/proposal.model';
import { ServerResponse } from '@models/app/server-response.model';
import { Validators, FormBuilder } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-proposal-edit',
  templateUrl: './proposal-edit.component.html',
  styleUrls: ['./proposal-edit.component.scss']
})
export class ProposalEditComponent implements OnInit {
  bonus: number;
  min: number;
  airportPickup: boolean;
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
    @Inject(MAT_DIALOG_DATA) public proposal: Proposal
  ) { }

  ngOnInit() {
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
    console.log(this.proposal);
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

  private serverError(error?: HttpErrorResponse) {
    if (error) {
      console.log(error);
    }
    const snackRef = this.snack.open('Une erreur s\'est produite', 'Réessayer', {duration: 5000});
    snackRef.onAction().subscribe(() => this.modifyProposal());
  }
}
