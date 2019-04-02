import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material';

import { NotConnectedComponent } from './not-connected/not-connected.component';
import { SocialDisconnectionComponent } from './social-disconnection/social-disconnection.component';

@NgModule({
  declarations: [NotConnectedComponent, SocialDisconnectionComponent],
  entryComponents: [NotConnectedComponent, SocialDisconnectionComponent],
  imports: [
    CommonModule,
    MatDialogModule,
  ],
  exports: [NotConnectedComponent, SocialDisconnectionComponent],
})
export class DialogsModule { }
