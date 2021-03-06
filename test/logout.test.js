const request = require("supertest");
const User = require("../database/models/user");

const setupDB = require("./utils/dbSetup");
const app = require("../app");


describe("Logout testing", () => {
  let user;
  let token;
  setupDB("logout_testing");

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

  // Test endpoint availability

  test("DELETE /authentications ~Test endpoint working~", async done => {
    let res = await request(app).delete('/authentications')
      .set("Authorization", `Bearer ${token}`)
      .expect(200)

    expect(res.tokens).toBeFalsy();

    done();
  });

  // Test Authorization Error Code

  test("DELETE /authentications ~Test Authorization Error Code~", async done => {
    await request(app).delete('/authentications')
      .set("Authorization", `Bearer ${token}`)

    await request(app).get('/authentications')
      .set("Authorization", `Bearer ${token}`)
      .expect(401)

    done();
  });

})
