var liveServer = require("live-server");
var waitOn = require('wait-on');

var params = {
  port: 5000,
  root: "dist",
  open: false,
  wait: 200,
  logLevel: 0,
  middleware: [function(req, res, next) {
    if(req.url.endsWith('.css') === false && req.url.endsWith('.js') === false) {
      waitOn({
        resources: [
          `${process.cwd()}/dist/assets/manifest.json`
        ]
      }, function() {
        res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.setHeader('Expires', '-1');
        res.setHeader('Pragma', 'no-cache');
        next();
      });
    } else {
      next();
    }
  }]
};

liveServer.start(params);
