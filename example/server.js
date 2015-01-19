'use strict';

var kserver = require('../index');
var path = require('path');

kserver({
  port: 8181, //默认8080
  path: path.join(__dirname, './files'),
  routes: {
    '-render.js': {
      wrap: false,
      path: path.join(__dirname, './xtpl')
    }
  }
});