import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  MatIconModule,
  MatExpansionModule,
  MatDatepickerModule,
  MatRippleModule,
  MatCardModule,
  MatSnackBarModule
} from '@angular/material';

import { PostComponent } from './post/post.component';
import { AvatarComponent } from './avatar/avatar.component';

import { PostListComponent } from './post-list/post-list.component';
import { PostFilterComponent } from './post-filter/post-filter.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { RemovePanelComponent } from './remove-panel/remove-panel.component';
import { ItemComponent } from './item/item.component';

@NgModule({
  declarations: [
    PostComponent,
    AvatarComponent,
    PostListComponent,
    PostFilterComponent,
    RemovePanelComponent,
    ItemComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatCardModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatRippleModule,
    MatSnackBarModule,
    RouterModule,
  ],
  exports: [
    AvatarComponent,
    PostComponent,
    PostListComponent,
    PostFilterComponent,
    RemovePanelComponent,
    ItemComponent,
  ],
})
export class SharedModule { }
