import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';

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
import { AccountBankDetailComponent } from './account-bank-detail/account-bank-detail.component';
import { AccountBankDetailResolver } from '@resolvers/account-bank-detail.resolver';

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
    AccountBankDetailComponent,
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
    MatRippleModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatTabsModule,
    ReactiveFormsModule,
  ],
  exports: [
    AccountComponent,
  ],
  providers: [AccountProposalResolver, AccountBalanceResolver, AccountBankDetailResolver],
})
export class AccountModule { }
