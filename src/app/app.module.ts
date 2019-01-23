import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import {
  MatIconModule,
  MatInputModule,
  MatProgressBarModule,
} from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from '@core/core.module';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from '@shared/shared.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AuthService } from '@core/auth.service';
import { PostService } from '@core/post.service';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    AuthModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    FormsModule,
    SharedModule,
    MatInputModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  providers: [AuthService, PostService],
  bootstrap: [AppComponent]
})
export class AppModule { }
