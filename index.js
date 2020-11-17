const express = require("express");
const app = express();

const usersRoute = require('./routes/users');
const loginRoute = require('./routes/login');

app.use(express.json());
app.use(express.urlencoded());

app.use('/users', usersRoute);
app.use('/login', loginRoute);

const port = 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
