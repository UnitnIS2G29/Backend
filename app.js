const express = require("express");
const cors = require("cors");
const app = express();
const morgan = require('morgan');

const usersRoute = require('./routes/users');
const loginRoute = require('./routes/login');
const categoriesRoute = require('./routes/categories');
const testRoute = require('./routes/testapi');

app.use(morgan('dev'));
app.use(cors());

app.use(express.json());
app.use(express.urlencoded());

app.use('/users', usersRoute);
app.use('/login', loginRoute);
app.use('/categories', categoriesRoute);
app.use('/test', testRoute);

module.exports = app;

