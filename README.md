# Mavericks

![npm shield](https://img.shields.io/npm/dt/mavericks.svg) ![npm shield](https://img.shields.io/npm/l/mavericks.svg)

> A RESTful API to your (Mon)Goose.

Mavericks is a simple RESTful API wrapper around the ExpressJS framework utilizing mongoose as the schema generator, and connection to your MongoDB instance

## Getting Started

Run `npm install --save mavericks` to add mavericks to your project.

## Basic Usage

Once installed, you can initialize an ExpressJS app with the Mavericks default settings in your `app.js`/`server.js` by:

```js
var Mavericks = require("mavericks");
var app = new Mavericks();

// Do some stuff to your express server
// ...

// Start our server
app.listen(3000, function(){
  console.log("Express server listening on port 3000")
})
```

### `Options`

#### options.src
* type: `string`
* default: `path.resolve(__dirname, 'models')`

This is the path to your Mongoose Schema Files

#### options.db
* type: `string`
* default: `'mongodb://@localhost:27017/data'`

This is the path to your MongoDB

#### options.logger
* type: `string`
* default: `'dev'`

## Basic Mongoose Schema

```js
module.exports = {
  name: String,
  email: String
};
```

This basic example simply exposes a new object to be required and ran through `mongoose.Schema`

## Modifying default routes

In order to modify the base routes used by Mavericks, simply expose your model schema as a function, and Mavericks will pass in our express instance so route overrides/addition can be made

*Note: This requires mongoose to be installed as a dependency if you would like to access your model*

```js
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

module.exports = function(app){
  var schema = {
    name: String,
    email: String
  }
  var model = new Schema(schema);

  app.get("my_model/", function(req, res, next){
    // some arbitrary get method used in place
    // of a default get route  

    mongoose.model('Model', model).find({}, function(e, results){
      // ...
    })
  });

  return schema;
}
```

## Default routes

By default Mavericks creates all the RESTful routes required by an API

### `get`
* type: `Array`
* return: `objects of the collection`

### `get :collection/:id`
* id: `id of the object`
* return_type: `Object`
* return: `object from the collection. Empty object if nothing`

### `get :collection/:id*`
* id*: `comma separated list of ids`
* return_type: `Array`
* return: `objects form the requested _ids`

### `post :collection/`
* return_type: `Object`
* return: `The saved model with _id`

### `put :colleciton/:id`
* id: `id of the object to update`
* return_type: `String`
* return: `success`/`error`

### `put :collection/:_id*`
* id*: `comma separated list of ids to update`
* return_type: `String`
* return: `success`/`error`

### `delete :collection/:id`
* id: `id of the object to delete`
* return_type: `String`
* return: `success`/`error`

### `delete :collection/:id*`
* id*: `comma separated list of ids to delete`
* return_type: `String`
* return: `success`/`error`
