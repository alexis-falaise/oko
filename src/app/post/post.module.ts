import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  MatCardModule,
  MatIconModule,
  MatInputModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatListModule,
  MatProgressBarModule,
  MatSnackBarModule,
  MatAutocompleteModule,
  MatExpansionModule,
  MatCheckboxModule,
  MatStepperModule,
  MatDialogModule,
  MatRippleModule,
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
import { TripListComponent } from './trip-list/trip-list.component';
import { RequestListComponent } from './request-list/request-list.component';
import { TripSizingComponent } from './trip/trip-sizing/trip-sizing.component';
import { TripLuggageComponent } from './trip/trip-luggage/trip-luggage.component';

@NgModule({
  declarations: [
    RequestComponent,
    RequestDetailComponent,
    RequestFormComponent,
    TripComponent,
    TripDetailComponent,
    TripLocationComponent,
    TripConstraintsComponent,
    TripListComponent,
    RequestListComponent,
    TripSizingComponent,
    TripLuggageComponent
  ],
  entryComponents: [
    TripLuggageComponent,
  ],
  imports: [
    CommonModule,
    DialogsModule,
    FormsModule,
    MatAutocompleteModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatListModule,
    MatRippleModule,
    MatSnackBarModule,
    MatStepperModule,
    ReactiveFormsModule,
    PostRoutingModule,
    SharedModule,
  ]
})
export class PostModule { }
