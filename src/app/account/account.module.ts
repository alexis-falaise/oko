import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatChipsModule,
  MatProgressBarModule,
  MatTabsModule,
  MatIconModule,
  MatButtonModule,
  MatSnackBarModule
} from '@angular/material';

import { SharedModule } from '@shared/shared.module';

import { AccountInfoComponent } from './account-info/account-info.component';
import { AccountItemComponent } from './account-item/account-item.component';
import { AccountTripComponent } from './account-trip/account-trip.component';
import { AccountRequestComponent } from './account-request/account-request.component';
import { AccountComponent } from './account.component';

@NgModule({
  declarations: [
    AccountComponent,
    AccountInfoComponent,
    AccountTripComponent,
    AccountRequestComponent,
    AccountItemComponent,
  ],
  entryComponents: [
    AccountComponent,
  ],
  imports: [
    RouterModule,
    SharedModule,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatTabsModule,
  ],
  exports: [
    AccountComponent,
  ]
})
export class AccountModule { }
