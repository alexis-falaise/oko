import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';

import { PostService } from '@core/post.service';

import { Proposal } from '@models/post/proposal.model';
import { ServerResponse } from '@models/app/server-response.model';

@Component({
  selector: 'app-proposal-edit',
  templateUrl: './proposal-edit.component.html',
  styleUrls: ['./proposal-edit.component.scss']
})
export class ProposalEditComponent implements OnInit {
  bonus: number;
  min: number;

  constructor(
    private postService: PostService,
    private dialogRef: MatDialogRef<ProposalEditComponent>,
    private snack: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public proposal: Proposal
  ) { }

  ngOnInit() {
    this.bonus = this.proposal.bonus || 0;
  }

  formatLabel(value: number) {
    if (value) {
      return Math.round(value) + '€';
    } else {
      return 0;
    }
  }

  modifyProposal() {
    this.postService.updateProposalBonus(this.proposal.id, this.bonus)
    .subscribe((response: ServerResponse) => {
      if (response.status) {
        this.snack.open('La proposition a bien été modifiée', 'Top', {duration: 3000});
        this.dialogRef.close(response.data);
      } else {
        this.serverError();
      }
    }, () =>  this.serverError());
  }

  close() {
    this.dialogRef.close();
  }

  private serverError() {
    const snackRef = this.snack.open('Une erreur s\'est produite', 'Réessayer', {duration: 5000});
    snackRef.onAction().subscribe(() => this.modifyProposal());
  }
}
