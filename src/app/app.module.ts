import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatIconModule,
  MatInputModule,
  MatProgressBarModule,
  MatTabsModule,
  MatChipsModule,
} from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from '@core/core.module';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from '@shared/shared.module';

import { AuthService } from '@core/auth.service';
import { PostService } from '@core/post.service';
import { UserService } from '@core/user.service';

import { AppComponent } from './app.component';
import { AccountComponent } from './account/account.component';
import { AccountInfoComponent } from './account/account-info/account-info.component';
import { HomeComponent } from './home/home.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AccountComponent,
    AccountInfoComponent,
  ],
  imports: [
    AuthModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    FormsModule,
    SharedModule,
    MatChipsModule,
    MatInputModule,
    MatIconModule,
    MatProgressBarModule,
    MatTabsModule,
  ],
  providers: [AuthService, PostService, UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
