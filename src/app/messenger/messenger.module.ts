import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  MatIconModule,
  MatBadgeModule,
  MatInputModule,
  MatProgressBarModule,
  MatButtonModule
} from '@angular/material';

import { SharedModule } from '@shared/shared.module';

import { ThreadComponent } from './thread/thread.component';
import { MessengerComponent } from './messenger.component';
import { ThreadListComponent } from './thread-list/thread-list.component';
import { ThreadNewComponent } from './thread-new/thread-new.component';
import { ContactListComponent } from './contact-list/contact-list.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ThreadComponent, MessengerComponent, ThreadListComponent, ThreadNewComponent, ContactListComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatInputModule,
    MatProgressBarModule,
  ],
  entryComponents: [ThreadNewComponent],
})
export class MessengerModule { }
