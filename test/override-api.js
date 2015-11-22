var superagent = require("superagent");
var expect = require("expect.js");

describe("express rest api with an override", function() {
  var id;

  it("posts an object", function(done) {
    superagent.post("http://localhost:3000/test-override")
      .send({
        name: "John",
        email: "john@rpjs.co"
      })
      .end(function(e, res) {
        // console.log(res.body)
        expect(e).to.eql(null);
        expect(res.body._id.length).to.eql(24);
        id = res.body._id;
        done();
      });
  });

  it("posts a second object", function(done) {
    superagent.post("http://localhost:3000/test-override")
      .send({
        name: "Jane",
        email: "jane@rpjs.co"
      })
      .end(function(e, res) {
        // console.log(res.body)
        expect(e).to.eql(null);
        expect(res.body._id.length).to.eql(24);
        second_id = res.body._id;
        done();
      });
  });

  it("posts a third object", function(done) {
    superagent.post("http://localhost:3000/test-override")
      .send({
        name: "Jeremy",
        email: "jeremy@rpjs.co"
      })
      .end(function(e, res) {
        // console.log(res.body)
        expect(e).to.eql(null);
        expect(res.body._id.length).to.eql(24);
        third_id = res.body._id;
        done();
      });
  });

  it("retrieves an object", function(done) {
    superagent.get("http://localhost:3000/test-override/" + id)
      .end(function(e, res) {
        // console.log(res.body)
        expect(e).to.eql(null);
        expect(typeof res.body).to.eql("object");
        expect(res.body._id.length).to.eql(24);
        expect(res.body._id).to.eql(id);
        expect(res.body.name).to.eql("John");
        done();
      });
  });

  it("retrieves multiple objects", function(done) {
    superagent.get("http://localhost:3000/test-override/" + id + "," + second_id)
      .end(function(e, res) {
        // console.log(res.body)
        var first_object = res.body[0];
        var second_object = res.body[1];
        expect(e).to.eql(null);
        expect(typeof res.body).to.eql("object");
        expect(first_object._id.length).to.eql(24);
        expect(first_object._id).to.eql(id);
        expect(first_object.name).to.eql("John");
        expect(second_object._id.length).to.eql(24);
        expect(second_object._id).to.eql(second_id);
        expect(second_object.name).to.eql("Jane");
        done();
      });
  });

  it("retrieves a collection", function(done) {
    superagent.get("http://localhost:3000/test-override")
      .end(function(e, res) {
        console.log(res.body)
        expect(e).to.eql(null);
        expect(res.body.test).to.eql("override successful");
        done();
      });
  });

  it("updates an object", function(done) {
    superagent.put("http://localhost:3000/test-override/" + id)
      .send({
        name: "Peter",
        email: "peter@yahoo.com"
      })
      .end(function(e, res) {
        // console.log(res.body)
        expect(e).to.eql(null);
        expect(typeof res.body).to.eql("object");
        expect(res.body.msg).to.eql("success");
        done();
      });
  });

  it("checks an updated object", function(done) {
    superagent.get("http://localhost:3000/test-override/" + id)
      .end(function(e, res) {
        // console.log(res.body)
        expect(e).to.eql(null);
        expect(typeof res.body).to.eql("object");
        expect(res.body._id.length).to.eql(24);
        expect(res.body._id).to.eql(id);
        expect(res.body.name).to.eql("Peter");
        done();
      });
  });

  it("removes an object", function(done) {
    superagent.del("http://localhost:3000/test-override/" + id)
      .end(function(e, res) {
        // console.log(res.body)
        expect(e).to.eql(null);
        expect(typeof res.body).to.eql("object");
        expect(res.body.msg).to.eql("success");
        done();
      });
  });

  it("removes multiple objects", function(done) {
    superagent.del("http://localhost:3000/test-override/" + second_id + "," + third_id)
      .end(function(e, res) {
        // console.log(res.body)
        expect(e).to.eql(null);
        expect(typeof res.body).to.eql("object");
        expect(res.body.msg).to.eql("success");
        done();
      });
  });
});
