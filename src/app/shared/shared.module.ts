import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

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
import { PictureUploadComponent } from './picture-upload/picture-upload.component';

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
    PictureUploadComponent,
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
    MatProgressBarModule,
    MatRippleModule,
    MatSnackBarModule,
    ScrollingModule,
    RouterModule,
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
