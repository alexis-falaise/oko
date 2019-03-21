import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MessengerService } from '@core/messenger.service';
import { User } from '@models/user.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-thread-new',
  templateUrl: './thread-new.component.html',
  styleUrls: ['./thread-new.component.scss']
})
export class ThreadNewComponent implements OnInit {
  users: Array<User>;
  userSearch: string;
  userSearchInput = new Subject();
  loading = false;
  currentUser: User;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<ThreadNewComponent>,
    private messengerService: MessengerService,
  ) { }

  ngOnInit() {
    if (this.data.user) {
      this.currentUser = this.data.user;
    } else {
      this.close();
    }
    this.getUsers();
  }

  search() {
    this.userSearchInput.next();
    this.getUsers();
  }

  getUsers() {
    this.loading = true;
    this.messengerService.getUsers(this.userSearch)
    .pipe(takeUntil(this.userSearchInput))
    .subscribe(users => {
      this.users = users;
      console.log(users);
      this.loading = false;
    });
  }

  close() {
    this.dialogRef.close();
  }

}
