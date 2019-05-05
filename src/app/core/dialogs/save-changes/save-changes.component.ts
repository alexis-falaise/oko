import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-save-changes',
  templateUrl: './save-changes.component.html',
  styleUrls: ['./save-changes.component.scss']
})
export class SaveChangesComponent {

  constructor(private dialogRef: MatDialogRef<SaveChangesComponent>) { }

  save() {
    this.dialogRef.close(true);
  }

  close() {
    this.dialogRef.close();
  }

}
