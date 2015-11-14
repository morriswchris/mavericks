var express = require("express");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bodyParser = require("body-parser");
var logger = require("morgan");
var fs = require("fs");
var path = require("path");

var defaults = {
  src: path.resolve("./", "models"),
  db: "mongodb://@localhost:27017/data",
  logger: "dev"
};

function initialize(opts) {
  var options = {};
  Object.assign(options, defaults, opts);
  var app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(logger(options.logger));

  var db = mongoose.connect(options.db);
  var cachedSchemas = {};
  var cachedModels = {};
  var files = fs.readdirSync(options.src);
  files.forEach(function(file) {
    var name = file.split(".")[0];
    var schema = require(options.src + "/" + name);
    //apply out express route overrides if a funciton is exposed
    if (typeof schema === "function"){
      schema = schema(app);
    }
    cachedSchemas[name] = new Schema(schema);
  });
  app.param("collection", function(req, res, next, collection) {
    //grab model if not in cached object
    var modelSchema = cachedSchemas[collection];
    model = cachedModels[collection] || mongoose.model(collection,
      modelSchema);
    req.collection = model;
    cachedModels[collection] = model;
    return next();
  });
  app.param("id", function(req, res, next, id) {
    var ids = id.split(",");
    req.params.ids = ids;
    return next();
  });

  app.get("/", function(req, res, next) {
    res.send("please select a collection, e.g., /collections/messages");
  });

  app.get("/:collection", function(req, res, next) {
    req.collection.find({}, null, {
      limit: 10,
      sort: {
        "_id": -1
      }
    }, function(e, results) {
      if (e) {
        return next(e);
      }
      res.send(results);
    });
  });

  app.post("/:collection", function(req, res, next) {
    req.collection.create(req.body, function(e, results) {
      if (e) {
        return next(e);
      }
      res.send(results);
    });
  });

  app.get("/:collection/:id", function(req, res, next) {
    req.collection.findById(req.params.id, function(e, result) {
      if (e) {
        return next(e);
      }
      res.send(result);
    });
  });

  app.put("/:collection/:id", function(req, res, next) {
    req.collection.update({
      "_id": {
        $in: req.params.ids
      }
    }, {
      $set: req.body
    }, {
      multi: false
    }, function(e, status) {
      if (e) {
        return next(e);
      }
      res.send((status.ok === 1) ? {
        msg: "success"
      } : {
        msg: "error"
      });
    });
  });

  app.delete("/:collection/:id", function(req, res, next) {
    req.collection.remove({
      "_id": {
        $in: req.params.ids
      }
    }, function(e, status) {
      if (e) {
        return next(e);
      }
      res.send((status.result.ok === 1) ? {
        msg: "success"
      } : {
        msg: "error"
      });
    });
  });

  return app;
}

//expose our initialize function
exports = module.exports = initialize;
