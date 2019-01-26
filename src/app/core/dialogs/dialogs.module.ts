import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material';

import { NotConnectedComponent } from './not-connected/not-connected.component';

@NgModule({
  declarations: [NotConnectedComponent],
  entryComponents: [NotConnectedComponent],
  imports: [
    CommonModule,
    MatDialogModule,
  ],
  exports: [NotConnectedComponent],
})
export class DialogsModule { }
