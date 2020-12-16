const request = require("supertest");
const User = require("../database/models/user");
const Category = require("../database/models/category");

const setupDB = require("./utils/dbSetup");

const app = require("../app");

describe("shifts testing", () => {
    let supervisor;
    let super_token;
    let employees;
    let employees_tokens;
    let categories;

    setupDB("shifts_testing");

    beforeEach(async () => {
        employees = []
        employees_tokens = []
        categories = []
        let superObj = {
            name: "Supervisor to Perform Actions",
            email: "testuser@test.com",
            role: "supervisor",
            password: "12345678",
        };
        supervisor = new User(superObj);
        supervisor = await supervisor.save();
        super_token = await supervisor.generateToken();

        let i;
        for (i = 0; i < 5; i++) {
            let userObj = {
                name: "employee #" + i,
                email: "emp" + i + "@test.com",
                role: "employee",
                password: "12345"
            }
            employees.push(new User(userObj))
            employees[i] = await employees[i].save()
            employees_tokens.push(await employees[i].generateToken())
        }

        for (i = 0; i < 5; i++) {
            let catObj = {
                name: "cat #" + i,
                description: "dasd"
            }
            categories.push(new Category(catObj))
            categories[i] = await categories[i].save()

        }
    });

    test("POST shifts: success",async done => {
        const res = await request(app).post('/shifts')
            .send({
                user: employees[0]._id,
                day: "2021-12-14T13:00:00.000Z",
                timeBegin: "2021-12-14T13:00:00.000Z",
                timeEnd: "2021-12-14T18:00:00.000Z",
                category: categories[0]._id
            })
            .set("Authorization", `Bearer ${super_token}`)
            .expect(201)
        done();
    });

    test("POST shifts: bad request because not an user",async done => {
        const res = await request(app).post('/shifts')
            .send({
                user: "definitively not an id",
                day: "2021-12-14T13:00:00.000Z",
                timeBegin: "2021-12-14T13:00:00.000Z",
                timeEnd: "2021-12-14T18:00:00.000Z",
                category: categories[0]._id
            })
            .set("Authorization", `Bearer ${super_token}`)
            .expect(400)
        done();
    });

    test("POST shifts: bad request because end < begin",async done => {
        const res = await request(app).post('/shifts')
            .send({
                user: employees[0]._id,
                day: "2021-12-14T13:00:00.000Z",
                timeBegin: "2021-12-14T18:00:00.000Z",
                timeEnd: "2021-12-14T13:00:00.000Z",
                category: categories[0]._id
            })
            .set("Authorization", `Bearer ${super_token}`)
            .expect(400)
        done();
    });

    test("POST shifts: bad request because wrong date format",async done => {
        const res = await request(app).post('/shifts')
            .send({
                user: employees[0]._id,
                day: "2021-12-14T13:000.000Z",
                timeBegin: "202112-14T13:00:00.000Z",
                timeEnd: "2021-12-1418:00:00.000Z",
                category: categories[0]._id
            })
            .set("Authorization", `Bearer ${super_token}`)
            .expect(400)
        done();
    });

    test("POST shifts: unauthorized",async done => {
        const res = await request(app).post('/shifts')
            .send({
                user: employees[0]._id,
                day: "2021-12-14T13:00:00.000Z",
                timeBegin: "2021-12-14T13:00:00.000Z",
                timeEnd: "2021-12-14T18:00:00.000Z",
                category: categories[0]._id
            })
            .set("Authorization", `Bearer ${employees_tokens[0]}`)
            .expect(401)
        done();
    });

    test("GET/self shifts: success", async done => {
        const resPost = await request(app).post('/shifts')
            .send({
                user: employees[0]._id,
                day: "2021-12-14T13:00:00.000Z",
                timeBegin: "2021-12-14T13:00:00.000Z",
                timeEnd: "2021-12-14T18:00:00.000Z",
                category: categories[0]._id
            })
            .set("Authorization", `Bearer ${super_token}`)
            .expect(201)

        const res = await request(app).get("/shifts/self")
            .set("Authorization", `${employees_tokens[0]}`)
            .expect(200)
            .expect((data) => {
                expect(data.body[0].day).toEqual(resPost.body.day);
                expect(data.body[0].timeBegin).toEqual(resPost.body.timeBegin);
                expect(data.body[0].timeEnd).toEqual(resPost.body.timeEnd);
                expect(data.body[0].category._id).toEqual(resPost.body.category);
            })
        done();
    });
});