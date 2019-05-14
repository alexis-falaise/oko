const port = 3000;
const publicIp = 'dev.meetoko.com';
const ip = '204.48.21.183';
const privateIp = '10.136.116.76';

export const environment = {
  production: true,
  avatarLocation: `https://${publicIp}/public/avatar`,
  serverPort: port,
  serverUrl: `https://${publicIp}/api`,
  ioUrl: `https://${publicIp}`,
  facebookAppId: '297767870905539',
  stripePrivateKey: 'sk_test_0hd9O8ohLK3AOjPfBvkyCepT00MBkEoYgs',
  stripePublicKey: 'pk_test_2ar3cNjZrPWED42u1JDRUtyu005WkFBHJ7',
  placesApiKey: 'AIzaSyBOjRTLq34Bnz-tLQaXSI1g43WPnIGMMCk',
};
