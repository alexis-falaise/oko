import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from 'app/guards/auth.guard';

import { AccountComponent } from './account.component';
import { AccountInfoComponent } from './account-info/account-info.component';
import { AccountRequestComponent } from './account-request/account-request.component';
import { AccountTripComponent } from './account-trip/account-trip.component';
import { AccountProposalComponent } from './account-proposal/account-proposal.component';
import { AccountBalanceComponent } from './account-balance/account-balance.component';
import { AccountProposalResolver } from '@resolvers/account-proposal.resolver';
import { AccountBalanceResolver } from '@resolvers/account-balance.resolver';

const routes: Routes = [
    { path: '', component: AccountComponent, canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: 'info', pathMatch: 'full' },
            { path: 'info', component: AccountInfoComponent },
            { path: 'request', component: AccountRequestComponent },
            { path: 'trip', component: AccountTripComponent },
            { path: 'proposal', component: AccountProposalComponent, resolve: {data: AccountProposalResolver} },
            { path: 'balance', component: AccountBalanceComponent, resolve: { user: AccountBalanceResolver } }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccountRoutingModule {}
