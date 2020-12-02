const request = require("supertest");
const User = require("../database/models/user");

const setupDB = require("./utils/dbSetup");
const app = require("../app");


describe("LOGIN testing", () => {
    let user;
    let token;

    setupDB("login_testing");

    beforeEach(async () => {
        let userObj = {
            name: "Test User to login",
            email: "testuser@test.com",
            role: "admin",
            password: "12345678",
        };
        user = new User(userObj);
        user = await user.save();
        token = await user.generateToken();
    });

    test("POST Login Success", async done => {
        const res = await request(app).post('/authentications').send({
            email: "testuser@test.com",
            password: "12345678"
        })
        .expect(200)
        .expect((data) => {
            expect(data.body.user.email).toEqual("testuser@test.com");
        });
        done();
    });

    test("POST Login Fail for MAIL", async done => {
        const res = await request(app).post('/authentications').send({
            email: "notcorrectmail@test.com",
            password: "notcorrectpassword"
        })
        .expect(404);
        done();
    });

    test("POST Login Fail for PASSWORD", async done => {
        const res = await request(app).post('/authentications').send({
            email: "testuser@test.com",
            password: "notcorrectpassword"
        })
        .expect(401);
        done();
    });

    test("POST Login Fail for missing field", async done => {
        const res = await request(app).post('/authentications').send({
            email: "testuser@test.com"
        })
        .expect(400);
        done();
    });

    test("POST Login Fail for nulled field", async done => {
        const res = await request(app).post('/authentications').send({
            email: null,
            password: null
        })
        .expect(400);
        done();
    });
})