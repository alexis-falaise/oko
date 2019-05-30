import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatInputModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatListModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatAutocompleteModule,
  MatExpansionModule,
  MatCheckboxModule,
  MatStepperModule,
  MatDialogModule,
  MatRippleModule,
  MatSlideToggleModule,
  MatSliderModule,
} from '@angular/material';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

import { PostRoutingModule } from './post-routing.module';
import { DialogsModule } from '@core/dialogs/dialogs.module';
import { SharedModule } from '@shared/shared.module';

import { RequestComponent } from './request/request.component';
import { RequestDetailComponent } from './request/request-detail/request-detail.component';
import { RequestFormComponent } from './request/request-form/request-form.component';
import { RequestListComponent } from './request/request-list/request-list.component';
import { TripComponent } from './trip/trip.component';
import { TripDetailComponent } from './trip/trip-detail/trip-detail.component';
import { TripLocationComponent } from './trip/trip-location/trip-location.component';
import { TripConstraintsComponent } from './trip/trip-constraints/trip-constraints.component';
import { TripListComponent } from './trip/trip-list/trip-list.component';
import { TripSizingComponent } from './trip/trip-sizing/trip-sizing.component';
import { TripLuggageComponent } from './trip/trip-luggage/trip-luggage.component';
import { RequestItemSelectionComponent } from './request/request-item-selection/request-item-selection.component';
import { ProposalComponent } from './proposal/proposal.component';
import { ProposalEditComponent } from './proposal-edit/proposal-edit.component';
import { ProposalEditMeetingComponent } from './proposal/proposal-edit-meeting/proposal-edit-meeting.component';
import { ProposalEditBonusComponent } from './proposal/proposal-edit-bonus/proposal-edit-bonus.component';
import { ProposalTripComponent } from './proposal/proposal-trip/proposal-trip.component';
import { ProposalRequestComponent } from './proposal/proposal-request/proposal-request.component';
import { RequestItemNewComponent } from './request/request-item-new/request-item-new.component';
import { RequestService } from './request/request.service';
import { TripDetailResolver } from '@resolvers/trip-detail.resolver';
import { RequestDetailResolver } from '@resolvers/request-detail.resolver';
import { RequestResolver } from '@resolvers/request.resolver';
import { ProposalPayComponent } from './proposal/proposal-pay/proposal-pay.component';
import { ProposalPayResolver } from '@resolvers/proposal-pay.resolver';
import { ProposalEditDateComponent } from './proposal/proposal-edit-date/proposal-edit-date.component';

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
    TripLuggageComponent,
    RequestItemSelectionComponent,
    ProposalComponent,
    ProposalEditComponent,
    ProposalEditMeetingComponent,
    ProposalEditBonusComponent,
    ProposalTripComponent,
    ProposalRequestComponent,
    RequestItemNewComponent,
    ProposalPayComponent,
    ProposalEditDateComponent,
  ],
  entryComponents: [
    TripLuggageComponent,
    RequestItemSelectionComponent,
    ProposalEditComponent,
    ProposalEditBonusComponent,
    ProposalEditMeetingComponent,
    ProposalEditDateComponent,
  ],
  imports: [
    CommonModule,
    DialogsModule,
    FormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatListModule,
    MatSlideToggleModule,
    MatRippleModule,
    MatSnackBarModule,
    MatSliderModule,
    MatStepperModule,
    NgxMaterialTimepickerModule.forRoot(),
    ReactiveFormsModule,
    PostRoutingModule,
    SharedModule,
    ScrollDispatchModule,
  ],
  providers: [
    ProposalPayResolver,
    RequestService,
    RequestResolver,
    RequestDetailResolver,
    TripDetailResolver,
  ],
})
export class PostModule { }
