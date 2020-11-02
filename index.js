const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded());

const port = 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
