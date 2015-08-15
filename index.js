'use strict';
/*jshint camelcase:false*/
var child_process = require('child_process');
var path = require('path');
var server = null;

module.exports = function(config) {
  /*jshint camelcase:false*/
  server = child_process.fork(path.resolve(__dirname, './lib/server.js'));
  server.send({
    cmd: 'start',
    data: {
      config: config,
    }
  });
};

process.on('uncaughtException', function(err) {
  if (err || !server) {
    throw new Error(err);
  } else {
    server.send({
      cmd: 'exit'
    });
  }
});
/*jshint unused:false*/
process.on('exit', function(code) {
  /*jshint -W030*/
  server && server.send({
    cmd: 'exit'
  });
});
