import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { RequestComponent } from './request/request.component';
import { TripComponent } from './trip/trip.component';

const routes: Routes = [
    { path: '', redirectTo: 'request', pathMatch: 'full' },
    { path: 'request', component: RequestComponent },
    { path: 'trip', component: TripComponent },
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
