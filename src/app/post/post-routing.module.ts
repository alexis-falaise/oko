import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ProposalComponent } from './proposal/proposal.component';
import { RequestComponent } from './request/request.component';
import { RequestListComponent } from './request/request-list/request-list.component';
import { RequestDetailComponent } from './request/request-detail/request-detail.component';
import { TripComponent } from './trip/trip.component';
import { TripListComponent } from './trip/trip-list/trip-list.component';
import { TripDetailComponent } from './trip/trip-detail/trip-detail.component';
import { RequestItemNewComponent } from './request/request-item-new/request-item-new.component';
import { TripDetailResolver } from '@resolvers/trip-detail.resolver';
import { RequestDetailResolver } from '@resolvers/request-detail.resolver';
import { RequestResolver } from '@resolvers/request.resolver';

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'proposal', redirectTo: '/account/proposal', pathMatch: 'full' },
    { path: 'proposal/:id', component: ProposalComponent },
    { path: 'request', component: RequestListComponent },
    { path: 'request/new', component: RequestComponent },
    { path: 'request/new/item', redirectTo: 'request/new', pathMatch: 'full' },
    { path: 'request/new/item/new', component: RequestItemNewComponent },
    { path: 'request/new/item/edit', component: RequestItemNewComponent },
    { path: 'request/:id', component: RequestDetailComponent, resolve: { requestInfo: RequestDetailResolver } },
    { path: 'request/:id/edit', component: RequestComponent, resolve: { request: RequestResolver } },
    { path: 'request/:id/edit/item', redirectTo: 'request/:id/edit', pathMatch: 'full' },
    { path: 'request/:id/edit/item/new', component: RequestItemNewComponent },
    { path: 'request/:id/edit/item/edit', component: RequestItemNewComponent },
    { path: 'trip', component: TripListComponent },
    { path: 'trip/new', component: TripComponent },
    { path: 'trip/propose/:id', component: TripComponent },
    { path: 'trip/:id', component: TripDetailComponent, resolve: { tripInfo: TripDetailResolver } },
    { path: 'trip/:id/order', component: TripDetailComponent, resolve: { tripInfo: TripDetailResolver } },
    { path: 'trip/:id/edit', component: TripComponent },
    { path: 'trip/:id/item', redirectTo: 'trip/:id', pathMatch: 'full' },
    { path: 'trip/:id/item/new', redirectTo: 'trip/:id/order/item/new', pathMatch: 'full' },
    { path: 'trip/:id/item/edit', redirectTo: 'trip/:id/order/item/edit', pathMatch: 'full' },
    { path: 'trip/:id/order/item', redirectTo: 'trip/:id/order', pathMatch: 'full' },
    { path: 'trip/:id/order/item/new', component: RequestItemNewComponent },
    { path: 'trip/:id/order/item/edit', component: RequestItemNewComponent },
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
