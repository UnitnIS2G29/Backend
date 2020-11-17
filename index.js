const express = require("express");
const app = express();

const timersRoute = require('./routes/timers');

app.use(express.json());
app.use(express.urlencoded());

app.use('/timers', timersRoute);

const port = 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});