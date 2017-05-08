exports.getBasicAuthCredentials = () => ({
  username: process.env.USERNAME,
  userpasswd: process.env.USERPASSWD,
});
