import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule, MatBadgeModule } from '@angular/material';

import { SharedModule } from '@shared/shared.module';

import { ThreadComponent } from './thread/thread.component';
import { MessengerComponent } from './messenger.component';
import { ThreadListComponent } from './thread-list/thread-list.component';

@NgModule({
  declarations: [ThreadComponent, MessengerComponent, ThreadListComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    MatIconModule,
    MatBadgeModule,
  ]
})
export class MessengerModule { }
