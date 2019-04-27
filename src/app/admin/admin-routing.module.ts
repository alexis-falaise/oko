import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminUserComponent } from './admin-user/admin-user.component';
import { AdminRequestComponent } from './admin-request/admin-request.component';
import { AdminTripComponent } from './admin-trip/admin-trip.component';
import { AdminGuard } from 'app/guards/admin.guard';

const routes: Routes = [
  { path: '', component: AdminComponent, canActivate: [AdminGuard], children: [
      { path: '', redirectTo: 'user', pathMatch: 'full' },
      { path: 'user', component: AdminUserComponent },
      { path: 'trip', component: AdminTripComponent },
      { path: 'request', component: AdminRequestComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
