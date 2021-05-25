import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';

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
