const app = require('./app');
const mongoose = require('mongoose');

const port = 3000;

const dbOptions = require('./database/dbConst');

mongoose.connect(process.env.DBURL, dbOptions).then(() => {
  console.log("Connected to mongo");
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
})

