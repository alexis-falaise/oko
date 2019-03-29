import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatListModule } from '@angular/material';

import { ProfileRoutingModule } from './profile-routing.module';
import { SharedModule } from '@shared/shared.module';

import { ProfileResolver } from '@resolvers/profile.resolver';

import { ProfileDetailsComponent } from './profile-details/profile-details.component';
import { ProfileRouteComponent } from './profile-route/profile-route.component';

@NgModule({
  declarations: [ProfileDetailsComponent, ProfileRouteComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatListModule,
    ProfileRoutingModule,
    SharedModule,
  ],
  providers: [ProfileResolver]
})
export class ProfileModule { }
