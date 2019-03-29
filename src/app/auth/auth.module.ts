import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatInputModule,
  MatProgressBarModule
} from '@angular/material';

import { LoginComponent } from './login/login.component';
import { SigninComponent } from './signin/signin.component';
import { LogoutComponent } from './logout/logout.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [LoginComponent, SigninComponent, LogoutComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    RouterModule,
  ]
})
export class AuthModule { }
