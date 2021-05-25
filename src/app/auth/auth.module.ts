import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { LoginComponent } from './login/login.component';
import { SigninComponent } from './signin/signin.component';
import { LogoutComponent } from './logout/logout.component';
import { RouterModule } from '@angular/router';
import { OneclickComponent } from './oneclick/oneclick.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [LoginComponent, SigninComponent, LogoutComponent, OneclickComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
  ]
})
export class AuthModule { }
