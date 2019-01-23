import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { RequestComponent } from './request/request.component';
import { TripComponent } from './trip/trip.component';
import { TripDetailComponent } from './trip-detail/trip-detail.component';
import { RequestDetailComponent } from './request-detail/request-detail.component';

const routes: Routes = [
    { path: '', redirectTo: 'request', pathMatch: 'full' },
    { path: 'request', component: RequestComponent },
    { path: 'request/:id', component: RequestDetailComponent },
    { path: 'trip', component: TripComponent },
    { path: 'trip/:id', component: TripDetailComponent },
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
export class PostRoutingModule { }
