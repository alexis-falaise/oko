import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {

  title: string;
  message: string;
  action: string;
  actionStyle: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<ConfirmComponent>,
  ) { }

  ngOnInit() {
    this.title = this.data.title;
    this.message = this.data.message;
    this.action = this.data.action;
    this.actionStyle = this.data.actionStyle;
  }

  close(action: boolean) {
    this.dialogRef.close(action);
  }

}
