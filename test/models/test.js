var Schema = require("mongoose").Schema;
module.exports = function(app){
  return new Schema({
    name     : String,
    email      : String
  });
}
