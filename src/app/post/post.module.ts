import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material';

import { PostRoutingModule } from './post-routing.module';
import { SharedModule } from '@shared/shared.module';

import { RequestComponent } from './request/request.component';
import { TripComponent } from './trip/trip.component';
import { TripDetailComponent } from './trip-detail/trip-detail.component';
import { RequestDetailComponent } from './request-detail/request-detail.component';
import { RequestFormComponent } from './request-form/request-form.component';
import { TripFormComponent } from './trip-form/trip-form.component';

@NgModule({
  declarations: [RequestComponent, TripComponent, TripDetailComponent, RequestDetailComponent, RequestFormComponent, TripFormComponent],
  imports: [
    CommonModule,
    MatIconModule,
    PostRoutingModule,
    SharedModule,
  ]
})
export class PostModule { }
