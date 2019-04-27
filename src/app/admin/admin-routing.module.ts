import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminUserComponent } from './admin-user/admin-user.component';
import { AdminRequestComponent } from './admin-request/admin-request.component';
import { AdminTripComponent } from './admin-trip/admin-trip.component';
import { AdminGuard } from 'app/guards/admin.guard';
import { AdminUserViewComponent } from './admin-user-view/admin-user-view.component';
import { AdminUserViewResolver } from '@resolvers/admin-user-view.resolver';

const routes: Routes = [
  { path: '', component: AdminComponent, canActivate: [AdminGuard], children: [
      { path: '', redirectTo: 'user', pathMatch: 'full' },
      { path: 'user', component: AdminUserComponent },
      { path: 'user/:id', component: AdminUserViewComponent, resolve: { user: AdminUserViewResolver } },
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
