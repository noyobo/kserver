'use strict';
var child_process = require('child_process');
var path = require('path');
var server = null;

module.exports = function(config) {
  server = child_process.fork(path.resolve(__dirname, './lib/server.js'));
  server.send({
    cmd: 'start',
    data: {
      config: config,
    }
  });
};

process.on('uncaughtException', function(err) {
  if (!server) {
    throw err;
  };
  server && server.send({
    cmd: 'exit'
  });
});

process.on('exit', function(code) {
  server && server.send({
    cmd: 'exit'
  });
});
