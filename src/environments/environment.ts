// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const port = 3000;

export const environment = {
  production: false,
  avatarLocation: `http://localhost:${port}/avatar`,
  pictureLocation: `http://localhost:${port}/picture`,
  serverPort: port,
  serverUrl: `http://localhost:${port}/api`,
  ioUrl: `http://localhost:${port}`,
  facebookAppId: '297767870905539',
  stripePrivateKey: 'sk_test_0hd9O8ohLK3AOjPfBvkyCepT00MBkEoYgs',
  stripePublicKey: 'pk_test_2ar3cNjZrPWED42u1JDRUtyu005WkFBHJ7',
  placesApiKey: 'AIzaSyBOjRTLq34Bnz-tLQaXSI1g43WPnIGMMCk',
  vapidPublicKey: 'BHEzKEtTHejaSZwlppmGScvY7tUZkMESvz-EeNu8McTMwPwk9T0AOw8jrREeu8tsu116SDYFjp-vbNprY8W69yE',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
