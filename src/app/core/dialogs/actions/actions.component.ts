import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<ActionsComponent>) { }

  ngOnInit() {
  }

  edit() {
    this.dialogRef.close('edit');
  }

  delete() {
    this.dialogRef.close('delete');
  }

}
