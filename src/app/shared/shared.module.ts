import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostComponent } from './post/post.component';
import { AvatarComponent } from './avatar/avatar.component';

import { MatIconModule } from '@angular/material';

@NgModule({
  declarations: [PostComponent, AvatarComponent],
  imports: [
    CommonModule,
    MatIconModule,
  ],
  exports: [PostComponent],
})
export class SharedModule { }
