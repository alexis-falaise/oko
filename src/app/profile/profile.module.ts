import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatListModule, MatSnackBarModule, MatProgressSpinnerModule } from '@angular/material';

import { ProfileRoutingModule } from './profile-routing.module';
import { SharedModule } from '@shared/shared.module';

import { ProfileResolver } from '@resolvers/profile.resolver';
import { ProfileRouteResolver } from '@resolvers/profile-route.resolver';

import { ProfileDetailsComponent } from './profile-details/profile-details.component';
import { ProfileRouteComponent } from './profile-route/profile-route.component';
import { ProfileRouteTripComponent } from './profile-route-trip/profile-route-trip.component';

@NgModule({
  declarations: [ProfileDetailsComponent, ProfileRouteComponent, ProfileRouteTripComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatListModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    ProfileRoutingModule,
    SharedModule,
  ],
  providers: [ProfileResolver],
})
export class ProfileModule { }
