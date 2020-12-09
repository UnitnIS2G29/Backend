const request = require("supertest");
const User = require("../database/models/user");
const CheckIn = require("../database/models/check-in");

const setupDB = require("./utils/dbSetup");
const app = require("../app");


describe("Check-in testing", () => {
  let user;
  let token;
  setupDB("check-in_testing");

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

  test("GET /check-in ~Test endpoint availability~", async done => {
    await request(app).get('/check-in/')
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
    done();
  });

  // Test endpoint failure for non-authenticated users

  test("GET /check-in ~Test endpoint failure for non-authenticated users~", async done => {
    await request(app).get('/check-in/')
      .expect(401)
    done();
  });

  // Test endpoint body returned

  test("GET /check-in ~Test endpoint body~", async done => {
    let req_date = new Date();
    let res = await request(app).get('/check-in/')
      .set("Authorization", `Bearer ${token}`)
      .expect(200)

    let res_date = new Date(res.body);
    expect(res_date).toBeInstanceOf(Date);
    expect(res_date.getHours).toBe(req_date.getHours);
    expect(res_date.getMinutes).toBe(req_date.getMinutes);

    done();
  });

  // Test endpoint data saved in DB

  test("GET /check-in ~Test endpoint data saved in DB~", async done => {
    let res = await request(app).get('/check-in/')
      .set("Authorization", `Bearer ${token}`)
      .expect(200)

    let checkin_data = await CheckIn.find();

    expect(checkin_data[0].user)
      .toEqual(user._id);

    expect(new Date(checkin_data[0].entrance.time))
      .toEqual(new Date(res.body));

    done();
  });
})
