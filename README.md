# Chusha

Tiny Dependency Injection Container for JavaScript applications.

# How to use

## Installing

```
npm install --save chusha
```

## Including Chusha

### NodeJS

`var Chusha = require('chusha')` in your code to use it.

### Browser

The production ready files are in the `dist/` directory. There are two files, one minified and one not.

Chusha supports UMD-style modules, so it works with AMD and CommonJS.
If you have no moduling system (You should!!), you can still access the Chusha object on the global `window` object.

## Usage

To define dependencies for an object, implement a static `inject()` method on the object, which return *an array of constructors*

```javascript
var HttpClient = require('./lib/HttpClient');

function MyObject(http) {
    this.http = http;
}
MyObject.inject = function() { return [HttpClient]; }

module.exports = MyObject;
```

Then, to grab a new object:

```javascript
var MyObject = require('./MyObject');
var Chusha = require('chusha');

var obj = Chusha.get(MyObject);
// obj now contains an instantiated MyObject instance with the HttpClient injected.
```

To pass additional parameters into a constructor:

```javascript
var HttpClient = require('./lib/HttpClient');

function MultiObject(http, server) {
    this.http = http;
    this.server = server;
}
MultiObject.inject = function() { return [HttpClient]; }

var obj = Chusha.get(MultiObject, "server-url");
// obj now contains an instantiated MultiObject instance with the HttpClient and server URL injected.
```

## Dependency sharing

Sometimes, you'd want to share the same instance throughout all objects that need it (Database connection handlers, HTTP clients, etc).

You can use the `Chusha.share()` and `Chusha.unshare()` methods to add objects to a pool of shared objects.

```javascript
var MyObject = require('./MyObject');
var Chusha = require('chusha');

Chusha.share({random: 'object'}, 'HttpClient'); // Share an object under the name 'http'.

var obj = Chusha.get(MyObject);
// obj now contains an instantiated MyObject instance with the HttpClient injected.
```

### `Chusha.share(obj[, hash])`
Store object in the pool under the hash specified in the second argument.

If a second argument is not specified, Chusha will use the object's constructor name.

```javascript
Chusha.share(new MyObject());
// same as Chusha.share(new MyObject(), 'MyObject');
```

#### Limitations
 - You cannot share plain objects, functions or primitives.
 - You cannot share two objects of the same constructor at the same time.
   Please explicitly call `Chusha.unshare()` before trying to share another instance of an object.

### `Chusha.unshare(hash)`
Remove the object under the hash specified in the first argument from the pool.

```javascript
Chusha.share(new MyObject());
Chusha.unshare('MyObject'); // Cancel the above statement.
```