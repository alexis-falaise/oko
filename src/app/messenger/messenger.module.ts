import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { SharedModule } from '@shared/shared.module';

import { ThreadComponent } from './thread/thread.component';
import { MessageComponent } from './message/message.component';
import { MessengerComponent } from './messenger.component';
import { ThreadListComponent } from './thread-list/thread-list.component';
import { ThreadNewComponent } from './thread-new/thread-new.component';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ThreadHeaderComponent } from './thread-header/thread-header.component';
import { ThreadRemoveComponent } from './thread-remove/thread-remove.component';

@NgModule({
  declarations: [
    ThreadComponent,
    ThreadListComponent,
    ThreadNewComponent,
    ThreadHeaderComponent,
    ThreadRemoveComponent,
    ContactListComponent,
    MessengerComponent,
    MessageComponent,
  ],
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
  entryComponents: [
    ThreadNewComponent,
    ThreadRemoveComponent
  ],
})
export class MessengerModule { }
