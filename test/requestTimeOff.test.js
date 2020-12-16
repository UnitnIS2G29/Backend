const request = require("supertest");
const User = require("../database/models/user");

const setupDB = require("./utils/dbSetup");
const app = require("../app");



describe("requestTimeOff testing", () => {
    let supervisor;
    let super_token;
    let employee;
    let employee_token;

    setupDB("requestTimeOff_testing");

    beforeEach(async () => {
        let superObj = {
            name: "Supervisor to Perform Actions",
            email: "testuser@test.com",
            role: "supervisor",
            password: "12345678",
        };
        supervisor = new User(superObj);
        supervisor = await supervisor.save();
        super_token = await supervisor.generateToken();
        let empObj = {
            name: "Basic employee",
            email: "testemp@test.com",
            role: "employee",
            password: "12345",
        };
        employee = new User(empObj);
        employee = await employee.save();
        employee_token = await employee.generateToken();
    });


    test("POST RequestTimeOff: success",async done => {
        const res = await request(app).post('/requestTimeOff')
        .send({
            day: "2021-12-14T13:00:00.000Z",
            timeBegin: "2021-12-14T13:00:00.000Z",
            timeEnd: "2021-12-14T18:00:00.000Z",
            category: "illness"   
        })
        .set("Authorization", `Bearer ${super_token}`)
        .expect(201)
        done();
    });

    test("POST RequestTimeOff: failure (wrong Date format)",async done => {
        const res = await request(app).post('/requestTimeOff')
        .send({
            day: "14/12/2021 1:00 PM",
            timeBegin: "14/12/2021 1:00 PM",
            timeEnd: "14/12/2021 6:00 PM",
            category: "illness"   
        })
        .set("Authorization", `Bearer ${super_token}`)
        .expect(400)
        done();
    });

    test("POST RequestTimeOff: failure (timeBegin is before timeEnd)",async done => {
        const res = await request(app).post('/requestTimeOff')
        .send({
            day: "2021-12-14T13:00:00.000Z",
            timeBegin: "2021-12-14T13:00:00.000Z",
            timeEnd: "2021-12-14T11:00:00.000Z",
            category: "illness"   
        })
        .set("Authorization", `Bearer ${super_token}`)
        .expect(400)
        done();
    });

    test("POST RequestTimeOff: failure (day is before today)",async done => {
        const res = await request(app).post('/requestTimeOff')
        .send({
            day: "1980-12-14T13:00:00.000Z",
            timeBegin: "2021-12-14T13:00:00.000Z",
            timeEnd: "2021-12-14T18:00:00.000Z",
            category: "illness"   
        })
        .set("Authorization", `Bearer ${super_token}`)
        .expect(400)
        done();
    });

    test("GET all RequestTimeOff: success",async done => {
        const resPost = await request(app).post('/requestTimeOff')
            .send({
                day: "2021-12-14T13:00:00.000Z",
                timeBegin: "2021-12-14T13:00:00.000Z",
                timeEnd: "2021-12-14T18:00:00.000Z",
                category: "illness"
            })
            .set("Authorization", `Bearer ${super_token}`)
            .expect(201)

        const resGetSelf = await request(app).get('/requestTimeOff')
            .set("Authorization", `Bearer ${super_token}`)
            .expect(200)
            .expect((data) => {
                expect(data.body[0].day).toEqual(resPost.body.day);
                expect(data.body[0].timeBegin).toEqual(resPost.body.timeBegin);
                expect(data.body[0].timeEnd).toEqual(resPost.body.timeEnd);
                expect(data.body[0].category).toEqual(resPost.body.category);
                expect(data.body[0].reviewed).toEqual(false);
            });
        done();
    });

    test("GET all RequestTimeOff: unauthorized",async done => {
        const resPost = await request(app).post('/requestTimeOff')
            .send({
                day: "2021-12-14T13:00:00.000Z",
                timeBegin: "2021-12-14T13:00:00.000Z",
                timeEnd: "2021-12-14T18:00:00.000Z",
                category: "illness"
            })
            .set("Authorization", `Bearer ${super_token}`)
            .expect(201)

        const resGetSelf = await request(app).get('/requestTimeOff')
            .set("Authorization", `Bearer ${employee_token}`)
            .expect(401)
        done();
    });

    test("GET/self RequestTimeOff: success",async done => {
        const resPost = await request(app).post('/requestTimeOff')
        .send({
            day: "2021-12-14T13:00:00.000Z",
            timeBegin: "2021-12-14T13:00:00.000Z",
            timeEnd: "2021-12-14T18:00:00.000Z",
            category: "illness"   
        })
        .set("Authorization", `Bearer ${super_token}`)
        .expect(201)

        const resGetSelf = await request(app).get('/requestTimeOff/self')
        .set("Authorization", `Bearer ${super_token}`)
        .expect(200)
        .expect((data) => {
            expect(data.body[0].day).toEqual(resPost.body.day);
            expect(data.body[0].timeBegin).toEqual(resPost.body.timeBegin);
            expect(data.body[0].timeEnd).toEqual(resPost.body.timeEnd);
            expect(data.body[0].category).toEqual(resPost.body.category);
            expect(data.body[0].reviewed).toEqual(false);
        });
        done();
    });

    test("Approve RequestTimeOff: success",async done => {
        const resPost = await request(app).post('/requestTimeOff')
        .send({
            day: "2021-12-14T13:00:00.000Z",
            timeBegin: "2021-12-14T13:00:00.000Z",
            timeEnd: "2021-12-14T18:00:00.000Z",
            category: "illness"   
        })
        .set("Authorization", `Bearer ${super_token}`)
        .expect(201)

        const resPut = await request(app).put('/requestTimeOff/'+resPost.body._id)
        .send({
            reviewed: "true",
            accepted: "true"   
        })
        .set("Authorization", `Bearer ${super_token}`)
        .expect(201)

        const resGetSelf = await request(app).get('/requestTimeOff/self')
        .set("Authorization", `Bearer ${super_token}`)
        .expect(200)
        .expect((data) => {
            expect(data.body[0].reviewed).toEqual(true);
            expect(data.body[0].accepted).toEqual(true);
        });
        done();
    });    

    test("Deny RequestTimeOff: success",async done => {
        const resPost = await request(app).post('/requestTimeOff')
        .send({
            day: "2021-12-14T13:00:00.000Z",
            timeBegin: "2021-12-14T13:00:00.000Z",
            timeEnd: "2021-12-14T18:00:00.000Z",
            category: "illness"   
        })
        .set("Authorization", `Bearer ${super_token}`)
        .expect(201)

        const resPut = await request(app).put('/requestTimeOff/'+resPost.body._id)
        .send({
            reviewed: "true",
            accepted: "false"   
        })
        .set("Authorization", `Bearer ${super_token}`)
        .expect(201)

        const resGetSelf = await request(app).get('/requestTimeOff/self')
        .set("Authorization", `Bearer ${super_token}`)
        .expect(200)
        .expect((data) => {
            expect(data.body[0].reviewed).toEqual(true);
            expect(data.body[0].accepted).toEqual(false);
        });
        done();
    });    


})