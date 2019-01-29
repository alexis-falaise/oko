import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { RequestComponent } from './request/request.component';
import { RequestListComponent } from './request-list/request-list.component';
import { TripComponent } from './trip/trip.component';
import { TripListComponent } from './trip-list/trip-list.component';
import { TripDetailComponent } from './trip-detail/trip-detail.component';
import { RequestDetailComponent } from './request-detail/request-detail.component';

const routes: Routes = [
    { path: '', redirectTo: 'request', pathMatch: 'full' },
    { path: 'request', component: RequestListComponent },
    { path: 'request/new', component: RequestComponent },
    { path: 'request/:id', component: RequestDetailComponent },
    { path: 'request/:id/edit', component: RequestComponent },
    { path: 'trip', component: TripListComponent },
    { path: 'trip/new', component: TripComponent },
    { path: 'trip/:id', component: TripDetailComponent },
    { path: 'trip/:id/edit', component: TripComponent },
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
