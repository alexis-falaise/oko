import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  MatIconModule,
  MatInputModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatProgressBarModule,
  MatSnackBarModule,
} from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

import { PostRoutingModule } from './post-routing.module';
import { DialogsModule } from '@core/dialogs/dialogs.module';
import { SharedModule } from '@shared/shared.module';

import { RequestComponent } from './request/request.component';
import { TripComponent } from './trip/trip.component';
import { TripDetailComponent } from './trip-detail/trip-detail.component';
import { RequestDetailComponent } from './request-detail/request-detail.component';
import { RequestFormComponent } from './request-form/request-form.component';
import { TripLocationComponent } from './trip/trip-location/trip-location.component';
import { TripConstraintsComponent } from './trip/trip-constraints/trip-constraints.component';

@NgModule({
  declarations: [
    RequestComponent,
    RequestDetailComponent,
    RequestFormComponent,
    TripComponent,
    TripDetailComponent,
    TripLocationComponent,
    TripConstraintsComponent
  ],
  imports: [
    CommonModule,
    DialogsModule,
    FormsModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    PostRoutingModule,
    SharedModule,
  ]
})
export class PostModule { }
