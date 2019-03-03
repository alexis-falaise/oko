import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountComponent } from './account.component';
import { AccountInfoComponent } from './account-info/account-info.component';
import { AccountRequestComponent } from './account-request/account-request.component';
import { AccountTripComponent } from './account-trip/account-trip.component';
import { AccountItemComponent } from './account-item/account-item.component';
import { AccountProposalComponent } from './account-proposal/account-proposal.component';

const routes: Routes = [
    { path: 'account', component: AccountComponent },
    { path: 'info', component: AccountInfoComponent },
    { path: 'request', component: AccountRequestComponent },
    { path: 'trip', component: AccountTripComponent },
    { path: 'item', component: AccountItemComponent },
    { path: 'proposal', component: AccountProposalComponent },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class AccountRoutingModule { }
