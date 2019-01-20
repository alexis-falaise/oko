import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostRoutingModule } from './post-routing.module';
import { RequestComponent } from './request/request.component';
import { TripComponent } from './trip/trip.component';

@NgModule({
  declarations: [RequestComponent, TripComponent],
  imports: [
    CommonModule,
    PostRoutingModule,
  ]
})
export class PostModule { }
