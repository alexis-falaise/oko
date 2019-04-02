import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatInputModule,
  MatProgressBarModule,
  MatIconModule
} from '@angular/material';

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
