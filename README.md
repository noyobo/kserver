kserver
========

[![Greenkeeper badge](https://badges.greenkeeper.io/noyobo/kserver.svg)](https://greenkeeper.io/)


[![npm version](http://img.shields.io/npm/v/kserver.svg)](https://www.npmjs.org/package/kserver) [![npm download](http://img.shields.io/npm/dm/kserver.svg)](https://www.npmjs.org/package/kserver) [![npm engines](http://img.shields.io/node/v/kserver.svg)](https://www.npmjs.org/package/kserver) [![build status](http://img.shields.io/travis/noyobo/kserver.svg)](https://travis-ci.org/noyobo/kserver) [![Coverage Status](https://img.shields.io/coveralls/noyobo/kserver.svg)](https://coveralls.io/r/noyobo/kserver) [![npm dependencise](https://david-dm.org/noyobo/kserver.svg)](https://david-dm.org/noyobo/kserver)


KISSY 静态资源服务, 便于开发调试. 不需要编译`js`直接运行;

## Install

```bash
$ npm install --save-dev kserver
```

## options

**mode**: ['kissy', 'define', 'modulex'] // 支持三种形式


## Demo

```javascript
var kserver = require('kserver')

kserver({
  path: path.join(__dirname, './files'),    // required
  port: 8181,                               // 默认: 8080
  mode: 'kissy'                             // 默认: kissy
  routes: {                                 // 路由规则
    '/xtpl/': {                             // 文件起始
      wrap: false,                          // 是否编译文件
      path: path.join(__dirname, './xtpl')  // 重定义目录
    }
  }
});

```
index.js source

```javascript
module.exports = {
  'a' : 'hello world'
};
```

http get > `http://127.0.0.1:8181/index.js` return :

```javascript
// kserver file path:C:\E\github\noyobo\kserver\example\src\index.js
KISSY.add(function(S ,require, exports, module) {
  module.exports = {
    'a' : 'hello world'
  };
});
```
http get > `http://127.0.0.1:8181/xtpl/index-render.js` return :

```javascript
// kserver file path:C:\E\github\noyobo\kserver\example\build\xtpl\index-render.js
module.exports = {
  'xtpl': 'hello world'
};
```
## 应用到项目中

```javascript
KISSY.config({
    packages: {
        'kserver': {
            path: 'http://127.0.0.1:8181',
            ignorePackageNameInUri: true
        }
    }
})

KISSY.use('kserver/', function(S, KS) {
    // 实际请求 http://127.0.0.1:8181/index.js
})
```
