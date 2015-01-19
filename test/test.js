'use strict';

var server = require('../example/server');

var request = require('supertest')


request = request('http://127.0.0.1:8181')

describe('test.js', function() {
  it('should request /index.js ok!', function(done) {
    request
      .get('/index.js')
      .expect(200, done);
  });
  it('should request /index.jss 404!', function(done) {
    request
      .get('/index.jss')
      .expect(404, done);
  });
  it('should request /404.js ok!', function(done) {
    request
      .get('/404.js')
      .expect(404, done);
  });
  it('should request /xtpl/index-render.js ok!', function(done) {
    request
      .get('/xtpl/index-render.js')
      .expect(200, done);
  });
  it('should request /index-render.js.js 404!', function(done) {
    request
      .get('/index-render.js.js')
      .expect(404, done);
  });
});
