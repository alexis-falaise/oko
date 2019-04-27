import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatCheckboxModule,
  MatIconModule,
  MatInputModule,
  MatFormFieldModule,
  MatTabsModule,
  MatTableModule,
  MatSlideToggleModule,
  MatPaginatorModule,
  MatTooltipModule,
} from '@angular/material';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AdminTripComponent } from './admin-trip/admin-trip.component';
import { AdminRequestComponent } from './admin-request/admin-request.component';
import { AdminUserComponent } from './admin-user/admin-user.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [AdminComponent, AdminTripComponent, AdminRequestComponent, AdminUserComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatCheckboxModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    SharedModule,
  ]
})
export class AdminModule { }
