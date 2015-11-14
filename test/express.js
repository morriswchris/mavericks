var Maverick = require("../lib/mavericks");
var path = require("path");
var app = new Maverick({
  db: "mongodb://@localhost:27017/test",
  logger: "dev",
  src: path.resolve(__dirname, "models")
});
app.listen(3000, function(){
  console.log("Express server listening on port 3000");
});
