import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Thread } from '@models/messenger/thread.model';
import { MessengerService } from '@core/messenger.service';
import { UiService } from '@core/ui.service';

@Component({
  selector: 'app-thread-remove',
  templateUrl: './thread-remove.component.html',
  styleUrls: ['./thread-remove.component.scss']
})
export class ThreadRemoveComponent implements OnInit {
  loading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public thread: Thread,
    private dialogRef: MatDialogRef<ThreadRemoveComponent>,
    private messenger: MessengerService,
    private snack: MatSnackBar,
    private uiService: UiService,
  ) { }

  ngOnInit() {
  }

  removeThread() {
    this.loading = true;
    this.messenger.deleteThread(this.thread)
    .subscribe(() => {
        this.loading = false;
        this.snack.open('La discussion a été supprimée', 'OK', {duration: 3000});
        this.close();
    }, (error) => this.uiService.serverError(error));
  }

  close() {
    this.dialogRef.close();
  }

}
