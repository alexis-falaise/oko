import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material';

import { PostRoutingModule } from './post-routing.module';
import { SharedModule } from '@shared/shared.module';

import { RequestComponent } from './request/request.component';
import { TripComponent } from './trip/trip.component';
import { TripDetailComponent } from './trip-detail/trip-detail.component';
import { RequestDetailComponent } from './request-detail/request-detail.component';

@NgModule({
  declarations: [RequestComponent, TripComponent, TripDetailComponent, RequestDetailComponent],
  imports: [
    CommonModule,
    MatIconModule,
    PostRoutingModule,
    SharedModule,
  ]
})
export class PostModule { }
