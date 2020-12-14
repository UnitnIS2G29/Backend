const request = require("supertest");
const User = require("../database/models/user");
const Category = require("../database/models/category");
const Timer = require("../database/models/timer");

const setupDB = require("./utils/dbSetup");
const app = require("../app");
const mongoose = require("mongoose");
const moment = require("moment");


describe("Timer testing", () => {
    let user;
    let token;

    setupDB("timer_testing");

    beforeEach(async () => {
        let userObj = {
            name: "Supervisor to Perform Actions",
            email: "testuser@test.com",
            role: "supervisor",
            password: "12345678",
        };
        user = new User(userObj);
        user = await user.save();
        token = await user.generateToken();
    });


    test("Start Timer: success",async done => {
        const res = await request(app).post('/timers/self')
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        done();
    });

    test("Start Timer: started_at is same or before the current time",async done => {
        const res = await request(app).post('/timers/self')
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .expect(function (data) {
            if ( !(moment(data.body.started_at).isSameOrBefore((moment(Date.now()))))) throw new Error("started_at is before the current time");
        });
        done();
    });

    test("Stop Timer: success",async done => {
        const resStart = await request(app).post('/timers/self')
        .set("Authorization", `Bearer ${token}`)
        .expect(200)

        const resStop = await request(app).patch('/timers/self')
        .set("Authorization", `Bearer ${token}`)
        .expect(200)

        done();
    });

    test("Stop Timer: failure (stopping non-existent timer) ",async done => {
        const resStop = await request(app).patch('/timers/self')
        .set("Authorization", `Bearer ${token}`)
        .expect(400)

        done();
    });

    test("GET Timer success",async done => {
        const resStart = await request(app).post('/timers/self')
        .set("Authorization", `Bearer ${token}`)
        .expect(200)

        const resStop = await request(app).patch('/timers/self')
        .set("Authorization", `Bearer ${token}`)
        .expect(200)

        const resGetAll = await request(app).get('/timers')
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .expect((data) => {
            expect(data.body[0].user).toEqual(resStart.body.user._id);
            expect(data.body[0].started_at).toBeDefined();
            expect(data.body[0].stopped_at).toBeDefined();      
            expect(data.body[0].category).not.toBeDefined();        
        });

        done();
    });

    test("GET running Timer success",async done => {
        const resStart = await request(app).post('/timers/self')
        .set("Authorization", `Bearer ${token}`)
        .expect(200)

        const resGetSelf = await request(app).get('/timers/self')
        .set("Authorization", `Bearer ${token}`)
        .expect(200)            
        .expect((data) => {
            expect(data.body.user).toEqual(resStart.body.user._id);
            expect(data.body.started_at).toBeDefined();
            expect(data.body.stopped_at).toBeNull();
            expect(data.body.category).not.toBeDefined();         
        });

        done();
    });

    test("Timer: usual use-case success",async done => {
        const resStart = await request(app).post('/timers/self')
        .set("Authorization", `Bearer ${token}`)
        .expect(200)

        const resGetSelf = await request(app).get('/timers/self')
        .set("Authorization", `Bearer ${token}`)
        .expect(200)            
        .expect((data) => {
            expect(data.body.user).toEqual(resStart.body.user._id);
            expect(data.body.started_at).toBeDefined();
            expect(data.body.stopped_at).toBeNull();
            expect(data.body.category).not.toBeDefined();         
        });

        const resStop = await request(app).patch('/timers/self')
        .set("Authorization", `Bearer ${token}`)
        .expect(200)

        const resGetAll = await request(app).get('/timers')
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .expect((data) => {
            expect(data.body[0].user).toEqual(resStart.body.user._id);
            expect(data.body[0].started_at).toBeDefined();
            expect(data.body[0].stopped_at).toBeDefined();      
            expect(data.body[0].category).not.toBeDefined();        
        });

        done();
    });
})