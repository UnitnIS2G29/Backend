const request = require("supertest");
const User = require("../database/models/user");
const Category = require("../database/models/category");

const setupDB = require("./utils/dbSetup");
const app = require("../app");


describe("CATEGORIES testing", () => {
    let user;
    let token;

    setupDB("categories_testing");

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

    test("POST Category create success",async done => {
        const res = await request(app).post('/categories')
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: "Nome della Categoria",
            description: "Descrizione della Categoria"
        })
        .expect(201)
        .expect((data) => {
            expect(data.body.name).toEqual("Nome della Categoria");
        });
        done();
    });

    test("POST Category create fail for missing field",async done => {
        const res = await request(app).post('/categories')
        .set("Authorization", `Bearer ${token}`)
        .send({})
        .expect(400);
        done();
    });

    test("GET Category success",async done => {
        const res = await request(app).post('/categories')
        .set("Authorization", `Bearer ${token}`)
        .send({name: "Nome della Categoria",description: "Descrizione della categoria"})
        .expect(201);

        const res2 = await request(app).get('/categories/'+res.body._id)
        .set("Authorization", `Bearer ${token}`)
        .send()
        .expect(200)
        .expect((data) => {
            expect(data.body.name).toEqual(res.body.name);
        });
        done();
    });

    test("GET Category fail",async done => {
        const res = await request(app).get('/categories/definitelynotanid')
        .set("Authorization", `Bearer ${token}`)
        .send()
        .expect(500);
        done();
    });

    test("PUT Category edit success",async done => {
        const res = await request(app).post('/categories')
        .set("Authorization", `Bearer ${token}`)
        .send({name: "Nome della Categoria",description: "Descrizione della categoria"})
        .expect(201);

        const res2 = await request(app).put('/categories/'+res.body._id)
        .set("Authorization", `Bearer ${token}`)
        .send({name: "Nuovo nome per la categoria",description:"Descrizione della categoria"})
        .expect(201);
        done();
    });

    test("DELETE Category success",async done => {
        const res = await request(app).post('/categories')
        .set("Authorization", `Bearer ${token}`)
        .send({name: "Nome della Categoria",description: "Descrizione della categoria"})
        .expect(201);

        const res2 = await request(app).delete('/categories/'+res.body._id)
        .set("Authorization", `Bearer ${token}`)
        .send()
        .expect(200);
        done();
    });
})