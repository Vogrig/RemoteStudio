var requirejs = require('requirejs');
var PORT = process.env.PORT || 8080;
requirejs.config({
    nodeRequire: require
});

requirejs(['app','io'],function(app, io) {
  app.listen(PORT);
});
