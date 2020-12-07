const express = require("express");
const cors = require("cors");
const app = express();
const morgan = require('morgan');

const requestTimeOff = require ('./routes/requestTimeOff');
const usersRoute = require('./routes/users');
const loginRoute = require('./routes/login');
const categoriesRoute = require('./routes/categories');
const departmentsRoute = require('./routes/departments');
const checkinRoute = require('./routes/check-in');
const timersRoute = require('./routes/timers');
const projectsRoute = require('./routes/projects');

app.use(morgan('dev'));
app.use(cors());

app.use(express.json());
app.use(express.urlencoded());

app.use('/requestTimeOff', requestTimeOff);
app.use('/users', usersRoute);
app.use('/authentications', loginRoute);
app.use('/categories', categoriesRoute);
app.use('/departments', departmentsRoute)
app.use('/check-in', checkinRoute);
app.use('/timers',timersRoute);
app.use('/projects', projectsRoute);

module.exports = app;

