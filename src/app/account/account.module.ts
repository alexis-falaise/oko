import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatChipsModule,
  MatProgressBarModule,
  MatTabsModule,
  MatIconModule,
  MatButtonModule,
  MatSnackBarModule,
  MatBottomSheetModule,
  MatListModule,
  MatDatepickerModule
} from '@angular/material';

import { SharedModule } from '@shared/shared.module';

import { AccountInfoComponent } from './account-info/account-info.component';
import { AccountItemComponent } from './account-item/account-item.component';
import { AccountTripComponent } from './account-trip/account-trip.component';
import { AccountRequestComponent } from './account-request/account-request.component';
import { AccountAvatarUploadComponent } from './account-avatar-upload/account-avatar-upload.component';
import { AccountComponent } from './account.component';
import { AccountProposalComponent } from './account-proposal/account-proposal.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

@NgModule({
  declarations: [
    AccountComponent,
    AccountInfoComponent,
    AccountTripComponent,
    AccountRequestComponent,
    AccountItemComponent,
    AccountAvatarUploadComponent,
    AccountProposalComponent,
  ],
  entryComponents: [
    AccountComponent,
    AccountAvatarUploadComponent,
  ],
  imports: [
    RouterModule,
    SharedModule,
    CommonModule,
    FormsModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatChipsModule,
    MatIconModule,
    MatListModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatTabsModule,
    ReactiveFormsModule,
  ],
  exports: [
    AccountComponent,
  ]
})
export class AccountModule { }
