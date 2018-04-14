const expect = require("chai").expect;
const request = require("request");

const URL = 'http://localhost:1337'
const REGISTER_URI = `${URL}/api/auth/register`;
const LOGIN_URI = `${URL}/api/auth/login`;
const user = `testuser+${Math.round(Math.random() * 1000)}`;
const password = 'test';

describe("Auth endpoints", function() {
  it("api should be up", function(done) {
    request.get(URL + '/api')
    .on('response', function(response) {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });
});
describe("Auth endpoints", function() {

  it("should register a user", function(done) {
    request.post(REGISTER_URI, {
      headers: {'content-type' : 'application/json'},
      body: JSON.stringify({username: user, password: password})
    })
    .on('response', function(response) {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it("should login the user", function(done) {
    request.post(LOGIN_URI, {
      headers: {'content-type' : 'application/json'},
      body: JSON.stringify({username: user, password: password})
    })
    .on('response', function(response) {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it("should fail at login in the user", function(done) {
    request.post(LOGIN_URI, {
      headers: {'content-type' : 'application/json'},
      body: JSON.stringify({username: user, password: 'badtest'})
    })
    .on('response', function(response) {
      expect(response.statusCode).to.equal(401);
      done();
    });
  });
});