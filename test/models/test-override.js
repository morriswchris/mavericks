module.exports = function(app) {

  app.get("/test-override", function(req, res, next){
    res.send({"test": "override successful"});
  });

  return {
    name: String,
    email: String
  }
}
