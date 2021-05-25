import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { NavComponent } from '@core/nav/nav.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NotFoundComponent } from './not-found/not-found.component';
import { DialogsModule } from './dialogs/dialogs.module';
import { SharedModule } from '@shared/shared.module';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { ApiInterceptor } from './api.interceptor';

@NgModule({
  declarations: [NavComponent, NotFoundComponent, ForbiddenComponent],
  imports: [
    CommonModule,
    SharedModule,
    DialogsModule,
    MatDialogModule,
    MatIconModule,
    MatRippleModule,
    RouterModule,
    HttpClientModule,
  ],
  exports: [
    NavComponent,
  ],
  providers: [
    HttpClientModule,
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true }
  ]
})
export class CoreModule { }
