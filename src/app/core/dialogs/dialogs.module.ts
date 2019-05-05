import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDividerModule, MatIconModule } from '@angular/material';

import { NotConnectedComponent } from './not-connected/not-connected.component';
import { SocialDisconnectionComponent } from './social-disconnection/social-disconnection.component';
import { InstallComponent } from './install/install.component';
import { SaveChangesComponent } from './save-changes/save-changes.component';

@NgModule({
  declarations: [NotConnectedComponent, SocialDisconnectionComponent, InstallComponent, SaveChangesComponent],
  entryComponents: [NotConnectedComponent, SocialDisconnectionComponent, InstallComponent, SaveChangesComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
  ],
  exports: [NotConnectedComponent, SocialDisconnectionComponent],
})
export class DialogsModule { }
