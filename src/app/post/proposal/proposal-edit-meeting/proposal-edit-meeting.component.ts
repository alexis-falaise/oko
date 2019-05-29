import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { PostService } from '@core/post.service';
import { Proposal } from '@models/post/proposal.model';
import { User } from '@models/user.model';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-proposal-edit-meeting',
  templateUrl: './proposal-edit-meeting.component.html',
  styleUrls: ['./proposal-edit-meeting.component.scss']
})
export class ProposalEditMeetingComponent implements OnInit {
  proposal: Proposal;
  currentUser: User;
  airportPickup: boolean;
  title = 'Modifier le lieu de remise';
  meeting = this.fb.group({
    address: ['', Validators.required],
    city: ['', Validators.required],
    country: ['', Validators.required],
    zip: [''],
  });

  constructor(
    private postService: PostService,
    private dialogRef: MatDialogRef<ProposalEditMeetingComponent>,
    private snack: MatSnackBar,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: {proposal: Proposal, user: User, title: string},
  ) { }

  ngOnInit() {
    if (this.data) {
      this.proposal = this.data.proposal;
      this.currentUser  = this.data.user;
      this.airportPickup = this.proposal.airportPickup;
      if (this.data.title) {
        this.title = this.data.title;
      }
      if (this.proposal.meetingPoint) {
        this.meeting.patchValue(this.proposal.meetingPoint);
      }
    }
  }

  updateMeeting() {
    this.proposal.airportPickup = this.airportPickup;
    this.proposal.meetingPoint = this.meeting.value;
    this.postService.updateProposal(this.proposal)
    .subscribe((response) => {
      if (response.status) {
        this.snack.open('La proposition a bien été modifiée', 'Top', {duration: 3000});
        this.dialogRef.close(response.data);
      }
    });
  }

  close() {
    this.dialogRef.close();
  }

}
