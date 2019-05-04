import { BrowserModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
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
  MatAutocompleteModule,
  MatButtonModule,
  GestureConfig,
} from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { SocialLoginModule, AuthServiceConfig, GoogleLoginProvider } from 'angularx-social-login';
import { FacebookLoginProvider } from 'angularx-social-login';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { environment } from '@env/environment';

import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from '@core/core.module';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from '@shared/shared.module';

import { AuthService } from '@core/auth.service';
import { GeoService } from '@core/geo.service';
import { PostService } from '@core/post.service';
import { UserService } from '@core/user.service';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MessengerModule } from './messenger/messenger.module';
import { LandingModule } from './landing/landing.module';

declare var Hammer: any;

export class MyHammerConfig extends GestureConfig {
  buildHammer(element: HTMLElement) {
    const mc = new Hammer(element, {
      touchAction: 'pan-y'
    });
    return mc;
  }
}
const config: SocketIoConfig = {url: environment.ioUrl, options: {}};

const facebookAppId = environment.facebookAppId;
const googleAppId = '70OW82UpWR1OJ0vNyl2aILsR';
const socialConfig = new AuthServiceConfig([
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider(facebookAppId)
  },
  // {
  //   id: GoogleLoginProvider.PROVIDER_ID,
  //   provider: new GoogleLoginProvider(googleAppId)
  // }
]);

export function provideSocialConfig() {
  return socialConfig;
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    AuthModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    DeviceDetectorModule.forRoot(),
    FormsModule,
    SharedModule,
    MatAutocompleteModule,
    MatButtonModule,
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
    MessengerModule,
    LandingModule,
    SocialLoginModule,
    SocketIoModule.forRoot(config),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [
    AuthService,
    GeoService,
    PostService,
    UserService,
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig
    },
    {
      provide: AuthServiceConfig,
      useFactory: provideSocialConfig,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
