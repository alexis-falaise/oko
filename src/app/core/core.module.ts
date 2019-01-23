import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material';

import { NavComponent } from '@core/nav/nav.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [NavComponent],
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule,
    HttpClientModule,
  ],
  exports: [
    NavComponent,
  ],
  providers: [HttpClientModule]
})
export class CoreModule { }
