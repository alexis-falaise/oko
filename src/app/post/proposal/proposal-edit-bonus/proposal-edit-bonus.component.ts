import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';

import { PostService } from '@core/post.service';

import { Proposal } from '@models/post/proposal.model';
import { ServerResponse } from '@models/app/server-response.model';
import { User } from '@models/user.model';

@Component({
  selector: 'app-proposal-edit-bonus',
  templateUrl: './proposal-edit-bonus.component.html',
  styleUrls: ['./proposal-edit-bonus.component.scss']
})
export class ProposalEditBonusComponent implements OnInit {
  bonus: number;
  min: number;
  max: number;
  currentUser: User;
  proposal: Proposal;

  constructor(
    private postService: PostService,
    private dialogRef: MatDialogRef<ProposalEditBonusComponent>,
    private snack: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: {proposal: Proposal, user: User},
    ) { }

  ngOnInit() {
    this.proposal = this.data.proposal;
    this.currentUser = this.data.user;
    this.bonus = this.proposal.bonus || 0;
    this.calculateBoundaries();
  }

  formatLabel(value: number) {
    if (value) {
      return Math.round(value) + '€';
    } else {
      return 0;
    }
  }

  updateBonus() {
    this.postService.updateProposalBonus(this.proposal.id, this.bonus)
    .subscribe((response: ServerResponse) => {
      if (response.status) {
        this.snack.open('La proposition a bien été modifiée', 'Top', {duration: 3000});
        console.log('Updated proposal', response.data);
        this.dialogRef.close(response.data);
      }
    });
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
    const lastOppositeUpdateIndex = bonusUpdates.reverse().findIndex(update => update.author.id !== this.currentUser.id);
    if (lastOppositeUpdateIndex === -1) {
      referentOffer = originalOffer;
    } else {
      let lastOppositeOffer;
      currentBonus = this.proposal.bonus;
      bonusUpdates.reverse().forEach((update, index) => {
        if (index <= lastOppositeUpdateIndex) {
          currentBonus = currentBonus - update.bonusDelta;
        }
      });
      lastOppositeOffer = currentBonus;
      referentOffer = lastOppositeOffer;
    }
    this.min = Math.floor(referentOffer * 0.6) || 1;
    this.max = Math.ceil(referentOffer * 2);
  }

}
