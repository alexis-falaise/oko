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
  MatSnackBarModule,
  MatSortModule,
  MatListModule,
} from '@angular/material';

import { AdminService } from './admin.service';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AdminTripComponent } from './admin-trip/admin-trip.component';
import { AdminRequestComponent } from './admin-request/admin-request.component';
import { AdminUserComponent } from './admin-user/admin-user.component';
import { SharedModule } from '@shared/shared.module';
import { AdminUserViewComponent } from './admin-user-view/admin-user-view.component';
import { AdminUserViewResolver } from '@resolvers/admin-user-view.resolver';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AdminComponent, AdminTripComponent, AdminRequestComponent, AdminUserComponent, AdminUserViewComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    MatCheckboxModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatListModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    SharedModule,
  ],
  providers: [AdminService, AdminUserViewResolver],
})
export class AdminModule { }
