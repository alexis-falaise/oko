import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { SigninComponent } from './auth/signin/signin.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { AccountComponent } from './account/account.component';

import { AuthGuard } from './guards/auth.guard';
import { AccountInfoComponent } from './account/account-info/account-info.component';
import { AccountRequestComponent } from './account/account-request/account-request.component';
import { AccountTripComponent } from './account/account-trip/account-trip.component';
import { AccountItemComponent } from './account/account-item/account-item.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard],
    children: [
      { path: 'info', component: AccountInfoComponent },
      { path: 'request', component: AccountRequestComponent },
      { path: 'trip', component: AccountTripComponent },
      { path: 'item', component: AccountItemComponent },
    ] },
  { path: 'post', loadChildren: 'app/post/post.module#PostModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
