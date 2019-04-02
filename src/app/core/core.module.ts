import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatRippleModule, MatDialogModule } from '@angular/material';

import { NavComponent } from '@core/nav/nav.component';
import { HttpClientModule } from '@angular/common/http';
import { NotFoundComponent } from './not-found/not-found.component';
import { DialogsModule } from './dialogs/dialogs.module';

@NgModule({
  declarations: [NavComponent, NotFoundComponent],
  imports: [
    CommonModule,
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
  providers: [HttpClientModule]
})
export class CoreModule { }
