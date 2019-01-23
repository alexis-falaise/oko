import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PostComponent } from './post/post.component';
import { AvatarComponent } from './avatar/avatar.component';

import { MatIconModule } from '@angular/material';
import { PostListComponent } from './post-list/post-list.component';

@NgModule({
  declarations: [PostComponent, AvatarComponent, PostListComponent],
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule,
  ],
  exports: [AvatarComponent, PostComponent, PostListComponent],
})
export class SharedModule { }
