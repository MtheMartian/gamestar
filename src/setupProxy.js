const {createProxyMiddleware} = require('http-proxy-middleware');

const context = [
  "/api"
];

module.exports = function(app){
  const appProxy = createProxyMiddleware(context, {
    target: "https://gsbackend.herokuapp.com",
    secure: false
  });

  app.use(appProxy);
}