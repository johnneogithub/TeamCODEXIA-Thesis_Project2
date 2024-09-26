const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:3001', // Make sure this matches your server port
      changeOrigin: true,
      timeout: 120000, // Increase timeout to 120 seconds
    })
  );
};