'use strict';

var http = require('http');
var path = require('path');
var mime = require('mime');
var assert = require('assert');
var fs = require('fs');
var copy = require('copy-to');
var debug = require('debug')('kserver');

var started = false;

var defaultOpt = {
  port: 8080,
  mode: 'kissy'
};

var header = {
  define: 'define(function(require, exports, module) {\n',
  modulex: 'define(function(require, exports, module) {\n',
  kissy: 'KISSY.add(function(S ,require, exports, module) {\n'
};
var wrapHeader;
var routes;

var globalOpt = null;

function getFile(url) {
  var routerPath = globalOpt.path,
    routerFlag = '',
    wrap = true;
  if (routes) {
    for (var i = 0; i < routes.length; i++) {
      var item = routes[i];
      if (url.indexOf(item) === 0) {
        routerFlag = item;
        break;
      }
    }
  }
  if (routerFlag) {
    var r = globalOpt.routes[routerFlag]
    routerPath = r.path;
    wrap = r.wrap && true;
  }
  if (url.charAt(0) === '/') {
    url = path.join(routerPath, url);
    url = path.resolve(url)
  }
  return {
    url: url,
    wrap: wrap
  };
}

function httpHandle(req, res) {
  try {
    var url = req.url.split('?')[0];
    var pathext = path.extname(url);
    if (pathext !== '.js') {
      res.writeHead(404);
      res.end('File type is not Javascript!');
    }
    var file = getFile(url);
    var wrap = file.wrap;
    url = file.url;
    debug(url);
    if (!fs.existsSync(url)) {
      res.writeHead(404);
      res.end('not Found');
    }
    fs.createReadStream(url)
      .on('readable', function() {
        res.writeHead(200, {
          'Content-Type': mime.lookup(pathext)
        });
        res.write('// kserver file path:' + url + '\n')
          /*jshint -W030*/
        wrap && res.write(wrapHeader)
      })
      .on('end', function() {
        /*jshint -W030*/
        wrap && res.end('\n});');
      })
      /*jshint unused:false*/
      .on('error', function(err) {
        res.writeHead(404);
        res.end('not Found');
      })
      .pipe(res);
  } catch (err) {
    res.writeHead(500);
    res.end(err.toString());
  }
}

function startServer(opt) {
  assert(opt && opt.path, 'options.path required');
  copy(defaultOpt).to(opt);
  globalOpt = opt;
  wrapHeader = header[opt.mode];
  assert(wrapHeader, 'The config mode it not support!')

  if (opt.routes) {
    routes = Object.keys(opt.routes)
  }

  return http.createServer(httpHandle).listen(opt.port, function() {
    console.log('kserver running at %s', opt.port);
  })
}

process.on('message', function(msg) {
  var cmd = msg.cmd;
  var data = msg.data;
  if (cmd === 'start') {
    if (!started) {
      started = true;
      process.nextTick(function() {
        startServer(data.config);
      });
    }
  } else if (cmd === 'exit') {
    console.log('kserver stop!');
    process.exit(1);
  }
});
