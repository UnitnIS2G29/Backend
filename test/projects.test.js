const request = require("supertest");
const User = require("../database/models/user");
const Category = require("../database/models/category");
const Timer = require("../database/models/timer");

const setupDB = require("./utils/dbSetup");
const app = require("../app");
const mongoose = require("mongoose");


describe("PROJECTS testing", () => {
    let user;
    let token;
    let category;
    let timers = new Array();

    setupDB("projects_testing");

    beforeEach(async () => {
        user = new User({
            name: "User to Perform Actions",
            email: "testuser@test.com",
            role: "admin",
            password: "12345678",
        });
        user = await user.save();
        token = await user.generateToken();

        category = new Category({
            name: "Progetto 1",
            description: "Progetto 2"
        });
        category = await category.save();

        let timer = null;
        for(let i in [1,2,3,4,5,6,7,8,9,10]){
            timer = new Timer({
                user: user,
                category: category,
                started_at: new Date(),
                stopped_at: new Date(),
                description: "Timer "+i
            });
            timer = await timer.save();
            timers.push(timer);
        }
    });

    test("GET Projects List",async done => {
        const res = await request(app).get('/projects')
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .expect((data) => {
            expect(data.body[0].name).toEqual("Progetto 1");
        });
        done();
    });

    test("GET Projects Details success",async done => {
        const res = await request(app).get('/projects/'+category._id + '/timers')
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .expect((data) => {
            expect(data.body.length).toEqual(10)
        });
        done();
    });
})