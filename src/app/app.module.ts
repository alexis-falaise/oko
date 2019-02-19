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
  MatDatepickerModule,
  MatExpansionModule,
  MatSnackBarModule,
  MatRippleModule,
} from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

import { AppRoutingModule } from './app-routing.module';
import { AccountModule } from './account/account.module';
import { CoreModule } from '@core/core.module';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from '@shared/shared.module';

import { AuthService } from '@core/auth.service';
import { GeoService } from '@core/geo.service';
import { PostService } from '@core/post.service';
import { UserService } from '@core/user.service';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    AuthModule,
    AccountModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    FormsModule,
    SharedModule,
    MatChipsModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatExpansionModule,
    MatInputModule,
    MatIconModule,
    MatProgressBarModule,
    MatTabsModule,
    MatRippleModule,
    MatSnackBarModule,
  ],
  providers: [
    AuthService,
    GeoService,
    PostService,
    UserService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
