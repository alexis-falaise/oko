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
  MatDatepickerModule,
  MatBadgeModule
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
import { AccountRoutingModule } from './account-routing.module';
import { AccountProposalResolver } from '@resolvers/account-proposal.resolver';
import { AccountBalanceComponent } from './account-balance/account-balance.component';
import { AccountBalanceResolver } from '@resolvers/account-balance.resolver';

@NgModule({
  declarations: [
    AccountComponent,
    AccountInfoComponent,
    AccountTripComponent,
    AccountRequestComponent,
    AccountItemComponent,
    AccountAvatarUploadComponent,
    AccountProposalComponent,
    AccountBalanceComponent,
  ],
  entryComponents: [
    AccountComponent,
    AccountAvatarUploadComponent,
  ],
  imports: [
    AccountRoutingModule,
    RouterModule,
    SharedModule,
    CommonModule,
    FormsModule,
    MatBadgeModule,
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
  ],
  providers: [AccountProposalResolver, AccountBalanceResolver],
})
export class AccountModule { }
