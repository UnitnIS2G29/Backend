const request = require("supertest");
const User = require("../database/models/user");
const Department = require("../database/models/department");

const setupDB = require("./utils/dbSetup");
const app = require("../app");


describe("Check-in testing", () => {
  let user;
  let token;
  setupDB("departments_testing");

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

  // Test get endpoint for retrieving all documents

  test("GET /departments ~Test get endpoint result~", async done => {
    let departments = [
    {
      name: "test 1",
      description: "test desc"
    },
    {
      name: "test 2",
      description: "test desc"
    },
    {
      name: "test 3",
      description: "test desc"
    },
    {
      name: "test 4",
      description: "test desc"
    },
    {
      name: "test 5"
    }];

    for( let el of departments) {
      let dep = new Department(el);
      await dep.save();
    }

    let res = await request(app).get('/departments/')
      .set("Authorization", `Bearer ${token}`)
      .expect(200)

    for (let i = 0; i < departments.length; i++ ) {
      expect(res.body[i].name).toEqual(departments[i].name);
    }

    done();
  });

  // Test getting single resource by id

  test("GET /departments/:id ~Test get by ID endpoint result~", async done => {
    let department = new Department({name:"test dep", description: "tet description"});
    department = await department.save();

    let res = await request(app).get(`/departments/${department._id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)

    expect(res.body.name).toEqual(department.name);

    done()
  });

  test("GET /departments/:id/employees ~Test get by ID endpoint result~", async done => {
    let users = [
    {
      name: "TestUser 1",
      email: "test1@test.com",
      role: "admin",
      password: "12345678",
    },
    {
      name: "TestUser 2",
      email: "test2@test.com",
      role: "supervisor",
      password: "12345678",
    },
    {
      name: "TestUser 3",
      email: "test3@test.com",
      role: "employee",
      password: "12345678",
    }];

    let dep = {name:"test dep", description: "tet description", employees: []}

    for( let user of users) {
      let tmp = new User(user);
      await tmp.save();
      dep.employees.push(tmp._id);
    };

    let department = new Department(dep);
    department = await department.save();

    let res = await request(app).get(`/departments/${department._id}/employees`) .set("Authorization", `Bearer ${token}`)
      .expect(200)

    for(let i = 0; i < res.body.length; i++) {
      expect(toString(res.body[i]._id)).toEqual(toString(department.employees[i]._id));
    }

    done()
  });

  // Test department creation

  test("POST /departments/ ~Test departments creation~", async done => {
    let department = {
      name: "R&D",
      description: "Research and Development Team"
    }

    let res = await request(app).post('/departments/')
      .set("Authorization", `Bearer ${token}`)
      .send(department)
      .expect(201);

    expect(res.body.name).toEqual(department.name);
    done();
  });

  // Test employee adding to department
  test("POST /departments/:id/employees ~Test departments creation~", async done => {
    let department = {
      name: "R&D",
      description: "Research and Development Team"
    }

    department = await Department(department);
    department = await department.save();

    let user =
    {
      name: "TestUser 1",
      email: "test1@test.com",
      role: "employee",
      password: "12345678",
    };

    user = await User(user);
    user = await user.save();

    let res = await request(app).post(`/departments/${department._id}/employees`)
      .set("Authorization", `Bearer ${token}`)
      .send({user: user._id})
      .expect(201);

    expect(toString(res.body.employees[0]._id)).toEqual(toString(user._id));
    done();
  });
})
