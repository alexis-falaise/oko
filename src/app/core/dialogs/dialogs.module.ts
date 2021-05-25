import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { NotConnectedComponent } from './not-connected/not-connected.component';
import { SocialDisconnectionComponent } from './social-disconnection/social-disconnection.component';
import { InstallComponent } from './install/install.component';
import { SaveChangesComponent } from './save-changes/save-changes.component';
import { ActionsComponent } from './actions/actions.component';
import { ConfirmComponent } from './confirm/confirm.component';

@NgModule({
  declarations: [
    ActionsComponent,
    ConfirmComponent,
    InstallComponent,
    NotConnectedComponent,
    SaveChangesComponent,
    SocialDisconnectionComponent,
  ],
  entryComponents: [
    ActionsComponent,
    ConfirmComponent,
    InstallComponent,
    NotConnectedComponent,
    SaveChangesComponent,
    SocialDisconnectionComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
  ],
  exports: [NotConnectedComponent, SocialDisconnectionComponent],
})
export class DialogsModule { }
