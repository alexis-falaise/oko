import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';

import { PostService } from '@core/post.service';

import { Proposal } from '@models/post/proposal.model';
import { ServerResponse } from '@models/app/server-response.model';
import { Validators, FormBuilder } from '@angular/forms';
import { Trip } from '@models/post/trip.model';
import { Request } from '@models/post/request.model';

@Component({
  selector: 'app-proposal-edit-date',
  templateUrl: './proposal-edit-date.component.html',
  styleUrls: ['./proposal-edit-date.component.scss']
})
export class ProposalEditDateComponent implements OnInit {
  proposal: Proposal;
  datetime = this.fb.group({
    date: ['', Validators.required],
    time: ['', Validators.required],
  });
  minDate: moment.Moment;
  maxDate: moment.Moment;
  today = moment();

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private snack: MatSnackBar,
    private dialogRef: MatDialogRef<ProposalEditDateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {proposal: Proposal}
  ) { }

  ngOnInit() {
    this.proposal = this.data.proposal;
    this.setDatetime();
    let trip, request;
    if (this.proposal.fromTrip) {
      trip = new Trip(this.proposal.from);
      request = new Request(this.proposal.to);
    } else {
      trip = new Trip(this.proposal.to);
      request = new Request(this.proposal.from);
    }
    this.minDate = trip.date;
    if (request.urgent) {
      this.maxDate = request.urgentDetails.date;
    }
  }

  updateDate() {
    const date = this.generateDate();
    this.postService.updateProposalDate(this.proposal.id, date)
    .subscribe((response: ServerResponse) => {
      if (response.status) {
        this.snack.open('La date de remise a bien été modifiée', 'Top', {duration: 3000});
        this.dialogRef.close(response.data);
      }
    });
  }

  close() {
    this.dialogRef.close();
  }

  private setDatetime() {
    if (this.proposal.pickupDate) {
      this.datetime.controls.date.patchValue(this.proposal.pickupDate);
      const time = moment(this.proposal.pickupDate).format('HH:mm');
      this.datetime.controls.time.patchValue(time);
    }
  }

  private generateDate(): moment.Moment {
    const date: moment.Moment = moment(this.datetime.controls.date.value).startOf('day');
    const time = this.datetime.controls.time.value.split(':');
    const hours = time[0];
    const minutes = time[1];
    const completeDate = date.add(hours, 'hours').add(minutes, 'minutes');
    return completeDate;
  }

}
