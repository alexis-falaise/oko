import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './auth/login/login.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { MessengerComponent } from './messenger/messenger.component';
import { NotFoundComponent } from '@core/not-found/not-found.component';
import { OneclickComponent } from './auth/oneclick/oneclick.component';
import { SigninComponent } from './auth/signin/signin.component';
import { ThreadListComponent } from './messenger/thread-list/thread-list.component';
import { ThreadComponent } from './messenger/thread/thread.component';

import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { ForbiddenComponent } from '@core/forbidden/forbidden.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'admin', loadChildren: () => import('app/admin/admin.module').then(m => m.AdminModule), canActivate: [AdminGuard] },
  { path: 'home', component: HomeComponent },
  { path: 'landing', component: LandingComponent },
  { path: 'oneclick', component: OneclickComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'account', loadChildren: () => import('app/account/account.module').then(m => m.AccountModule) },
  { path: 'post', loadChildren: () => import('app/post/post.module').then(m => m.PostModule) },
  { path: 'profile', loadChildren: () => import('app/profile/profile.module').then(m => m.ProfileModule) },
  { path: 'messages', component: MessengerComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: ThreadListComponent },
      { path: 'thread', redirectTo: '/messages', pathMatch: 'full' },
      { path: 'thread/:id', component: ThreadComponent },
    ]
  },
  { path: '404', component: NotFoundComponent },
  { path: '403', component: ForbiddenComponent },
  { path: '401', component: ForbiddenComponent },
  { path: '**', redirectTo: '404', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
