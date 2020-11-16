const express = require("express");
const app = express();

const usersRoute = require('./routes/users');

app.use(express.json());
app.use(express.urlencoded());

app.use('/users', usersRoute);

const port = 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
