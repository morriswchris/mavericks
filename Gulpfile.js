var gulp = require("gulp");
var mocha = require("gulp-mocha");
var nodemon = require("gulp-nodemon");
var exec = require("child_process").exec;
var fs = require("fs");
var del = require("del");

gulp.task("test", ["mocha"], function() {
  exec("mongo admin --eval 'db.shutdownServer();'", function(erro, stdout,
    stderr) {
    del.sync(["data/"]);
    process.exit();
  });
});

gulp.task("mocha", ["server"], function() {
  return gulp.src("test/*.js", {
    read: false
  }).pipe(mocha({
    reporter: "nyan"
  }));
});

gulp.task("server", function() {
  // make our mongo data dir
  fs.mkdirSync("data/");
  exec("mongod --dbpath data/", function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    if (err !== null) {
      console.error(err);
    }
  });
  return nodemon({
    script: "test/express.js",
    env: {
      "NODE_ENV": "development"
    }
  });
});
