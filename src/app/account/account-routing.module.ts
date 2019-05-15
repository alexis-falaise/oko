import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from 'app/guards/auth.guard';

import { AccountComponent } from './account.component';
import { AccountInfoComponent } from './account-info/account-info.component';
import { AccountRequestComponent } from './account-request/account-request.component';
import { AccountTripComponent } from './account-trip/account-trip.component';
import { AccountProposalComponent } from './account-proposal/account-proposal.component';
import { AccountBalanceComponent } from './account-balance/account-balance.component';
import { AccountBankDetailComponent } from './account-bank-detail/account-bank-detail.component';
import { AccountProposalResolver } from '@resolvers/account-proposal.resolver';
import { AccountBalanceResolver } from '@resolvers/account-balance.resolver';
import { AccountBankDetailResolver } from '@resolvers/account-bank-detail.resolver';

const routes: Routes = [
    { path: '', component: AccountComponent, canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: 'info', pathMatch: 'full' },
            { path: 'info', component: AccountInfoComponent },
            { path: 'request', component: AccountRequestComponent },
            { path: 'trip', component: AccountTripComponent },
            { path: 'proposal', component: AccountProposalComponent, resolve: {data: AccountProposalResolver},
                children: [
                    { path: '', redirectTo: 'received', pathMatch: 'full' },
                    { path: 'deliver', component: AccountProposalComponent },
                    { path: 'upcoming', component: AccountProposalComponent },
                    { path: 'received', component: AccountProposalComponent },
                    { path: 'sent', component: AccountProposalComponent },
                ]
            },
            { path: 'balance', component: AccountBalanceComponent, resolve: { user: AccountBalanceResolver },
                children: [
                    { path: '', component: AccountBalanceComponent },
                    { path: 'settings', component: AccountBalanceComponent },
                    { path: 'history', component: AccountBalanceComponent }
                ]
            }
        ]
    },
    { path: 'balance/bank-detail', component: AccountBankDetailComponent },
    { path: 'balance/bank-detail/:iban', component: AccountBankDetailComponent, resolve: { account: AccountBankDetailResolver } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccountRoutingModule {}
