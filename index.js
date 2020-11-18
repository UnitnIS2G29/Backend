const express = require("express");
const app = express();
const morgan = require('morgan');

const usersRoute = require('./routes/users');
const loginRoute = require('./routes/login');
const categoriesRoute = require('./routes/categories');

app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded());

app.use('/users', usersRoute);
app.use('/login', loginRoute);
app.use('/categories', categoriesRoute);

const port = 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
