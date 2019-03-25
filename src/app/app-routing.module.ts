import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from '@core/not-found/not-found.component';
import { LoginComponent } from './auth/login/login.component';
import { SigninComponent } from './auth/signin/signin.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { AccountComponent } from './account/account.component';

import { AuthGuard } from './guards/auth.guard';
import { AccountInfoComponent } from './account/account-info/account-info.component';
import { AccountRequestComponent } from './account/account-request/account-request.component';
import { AccountTripComponent } from './account/account-trip/account-trip.component';
import { AccountProposalComponent } from './account/account-proposal/account-proposal.component';
import { MessengerComponent } from './messenger/messenger.component';
import { ThreadListComponent } from './messenger/thread-list/thread-list.component';
import { ThreadComponent } from './messenger/thread/thread.component';
import { ProposalComponent } from './post/proposal/proposal.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'proposal', pathMatch: 'full' },
      { path: 'info', component: AccountInfoComponent },
      { path: 'request', component: AccountRequestComponent },
      { path: 'trip', component: AccountTripComponent },
      { path: 'proposal', component: AccountProposalComponent },
    ] },
  { path: 'post', loadChildren: 'app/post/post.module#PostModule' },
  { path: 'messages', component: MessengerComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: ThreadListComponent },
      { path: 'thread', component: ThreadListComponent },
      { path: 'thread/:id', component: ThreadComponent },
    ]},
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '404', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
