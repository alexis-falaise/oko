const port = 3000;
const publicIp = '204.48.21.183';
const privateIp = '10.136.116.76';

export const environment = {
  production: true,
  avatarLocation: `http://${publicIp}/api/avatar`,
  serverPort: port,
  serverUrl: `http://${publicIp}/api`,
};
