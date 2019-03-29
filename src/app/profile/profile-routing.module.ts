import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ProfileDetailsComponent } from './profile-details/profile-details.component';
import { ProfileRouteComponent } from './profile-route/profile-route.component';
import { ProfileResolver } from '@resolvers/profile.resolver';

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full'},
    { path: ':id', component: ProfileDetailsComponent, resolve: { user: ProfileResolver } },
    { path: ':id/route', component: ProfileRouteComponent },
];

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(routes),
    ],
    exports: [
      RouterModule,
    ]
  })
  export class ProfileRoutingModule { }
