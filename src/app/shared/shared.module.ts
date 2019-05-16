import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  MatIconModule,
  MatExpansionModule,
  MatDatepickerModule,
  MatRippleModule,
  MatCardModule,
  MatSnackBarModule,
  MatCheckboxModule,
  MatListModule,
  MatChipsModule
} from '@angular/material';

import { PostComponent } from './post/post.component';
import { AvatarComponent } from './avatar/avatar.component';

import { PostListComponent } from './post-list/post-list.component';
import { PostFilterComponent } from './post-filter/post-filter.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { RemovePanelComponent } from './remove-panel/remove-panel.component';
import { ItemComponent } from './item/item.component';
import { RatingComponent } from './rating/rating.component';
import { ProposalListComponent } from './proposal-list/proposal-list.component';
import { SpaceIndicatorComponent } from './space-indicator/space-indicator.component';
import { ProposalListItemComponent } from './proposal-list-item/proposal-list-item.component';
import { ItemDetailsComponent } from './item-details/item-details.component';
import { CityDisplayComponent } from './city-display/city-display.component';
import { AddressDisplayComponent } from './address-display/address-display.component';

@NgModule({
  declarations: [
    PostComponent,
    AvatarComponent,
    PostListComponent,
    PostFilterComponent,
    RemovePanelComponent,
    ItemComponent,
    RatingComponent,
    ProposalListComponent,
    ProposalListItemComponent,
    SpaceIndicatorComponent,
    ItemDetailsComponent,
    CityDisplayComponent,
    AddressDisplayComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatChipsModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatIconModule,
    MatListModule,
    MatMomentDateModule,
    MatRippleModule,
    MatSnackBarModule,
    ScrollDispatchModule,
    RouterModule,
  ],
  entryComponents: [
    ItemDetailsComponent,
  ],
  exports: [
    AddressDisplayComponent,
    AvatarComponent,
    CityDisplayComponent,
    PostComponent,
    PostListComponent,
    PostFilterComponent,
    RemovePanelComponent,
    ItemComponent,
    RatingComponent,
    ProposalListComponent,
    ProposalListItemComponent,
    SpaceIndicatorComponent,
  ],
})
export class SharedModule { }
