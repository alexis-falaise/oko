import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDividerModule, MatIconModule } from '@angular/material';

import { NotConnectedComponent } from './not-connected/not-connected.component';
import { SocialDisconnectionComponent } from './social-disconnection/social-disconnection.component';
import { InstallComponent } from './install/install.component';

@NgModule({
  declarations: [NotConnectedComponent, SocialDisconnectionComponent, InstallComponent],
  entryComponents: [NotConnectedComponent, SocialDisconnectionComponent, InstallComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
  ],
  exports: [NotConnectedComponent, SocialDisconnectionComponent],
})
export class DialogsModule { }
