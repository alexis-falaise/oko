import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {

  title: string;
  message: string;
  action = 'Continuer';
  actionStyle = 'btn-danger';
  cancel = 'Annuler';
  cancelStyle = 'btn-light';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<ConfirmComponent>,
  ) { }

  ngOnInit() {
    this.title = this.data.title;
    this.message = this.data.message;
    this.action = this.data.action;
    this.actionStyle = this.data.actionStyle;
    if (this.data.cancel) {
      this.cancel = this.data.cancel;
    }
    if (this.data.cancelStyle) {
      this.cancelStyle = this.data.cancelStyle;
    }
  }

  close(action: boolean) {
    this.dialogRef.close(action);
  }

}
