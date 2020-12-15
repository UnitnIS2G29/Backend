const request = require("supertest");
const User = require("../database/models/user");

const setupDB = require("./utils/dbSetup");
const app = require("../app");


describe("Password testing", () => {
  let user;
  let token;
  setupDB("passwordChange_testing");

  beforeEach(async () => {
    let userObj = {
      name: "TestUser",
      email: "test@test.com",
      role: "admin",
      password: "12345678",
    };
    user = new User(userObj);
    user = await user.save();
    token = await user.generateToken();
  });

  // Test for user change in Database

  test("PUT /users/self/password ~Test user change in DB~", async done => {
    let res = await request(app).put('/users/self/password')
      .set("Authorization", `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send({password: "87654321"})


    expect(res.body.password).toEqual('87654321');

    expect(res.tokens).toBeFalsy();

    done();
  });

})
