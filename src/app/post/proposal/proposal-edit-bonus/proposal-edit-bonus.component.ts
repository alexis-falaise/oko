import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';

import { PostService } from '@core/post.service';

import { Proposal } from '@models/post/proposal.model';
import { ServerResponse } from '@models/app/server-response.model';

@Component({
  selector: 'app-proposal-edit-bonus',
  templateUrl: './proposal-edit-bonus.component.html',
  styleUrls: ['./proposal-edit-bonus.component.scss']
})
export class ProposalEditBonusComponent implements OnInit {
  bonus: number;
  min: number;

  constructor(
    private postService: PostService,
    private dialogRef: MatDialogRef<ProposalEditBonusComponent>,
    private snack: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public proposal: Proposal
    ) { }

  ngOnInit() {
    this.bonus = this.proposal.bonus || 0;
  }

  updateBonus() {
    this.postService.updateProposalBonus(this.proposal.id, this.bonus)
    .subscribe((response: ServerResponse) => {
      if (response.status) {
        this.snack.open('La proposition a bien été modifiée', 'Top', {duration: 3000});
        this.dialogRef.close(response.data);
      }
    });
  }

}
