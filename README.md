# Chusha

Tiny Dependency Injection Container for JavaScript applications.

# How to use

## Including Chusha

Depends on your current moduling system, Chusha offers multiple distribution files, all files have a minified version:

 - chusha.amd.js - for AMD modules (like RequireJS)
 - chusha.cjs.js - for CommonJS modules (like Browserify and NodeJS)
 - chusha.es6.js - for ES6 modules (like in a few years, or today with 6to5 or Google Traceur)
 - chusha.win.js - for no modules (a Chusha object will be appended to the window object. Please consider using a proper moduling system!)

## Usage

To define dependencies for an object, implement a static `inject()` method on the object, which return *an array of constructors*

    var HttpClient = require('./lib/HttpClient');

    function MyObject(http) {
        this.http = http;
    }
    MyObject.inject = function() { return [HttpClient]; }

    module.exports = MyObject;

Then, to grab a new object:

    var MyObject = require('./MyObject');
    var Chusha = require('chusha');

    var obj = Chusha.get(MyObject);
    // obj now contains an instantiated MyObject instance with the HttpClient injected.

## Dependency sharing

Sometimes, you'd want to share the same instance throughout all objects that need it (Database connection handlers, HTTP clients, etc).

You can use the `Chusha.share()` and `Chusha.unshare()` methods to add objects to a pool of shared objects.

        var MyObject = require('./MyObject');
        var Chusha = require('chusha');

        Chusha.share({random: 'object'}, 'http'); // Share an object under the name 'http'.

        var obj = Chusha.get(MyObject);
        // obj now contains an instantiated MyObject instance with the HttpClient injected.

### `Chusha.share(obj[, hash])`
Store object in the pool under the hash specified in the second argument.

If a second argument is not specified, Chusha will use the object's constructor name.

    Chusha.share(new MyObject());
    // same as Chusha.share(new MyObject(), 'MyObject');

#### Limitations
 - You cannot share plain objects, functions or primitives.
 - You cannot share two objects of the same constructor at the same time.
   Please explicitly call `Chusha.unshare()` before trying to share another instance of an object.

### `Chusha.unshare(hash)`
Remove the object under the hash specified in the first argument from the pool.

    Chusha.share(new MyObject());
    Chusha.unshare('MyObject'); // Cancel the above statement.