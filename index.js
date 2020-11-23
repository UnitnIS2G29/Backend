const app = require('./app');
const mongoose = require('mongoose');

const usersRoute = require('./routes/users');
const loginRoute = require('./routes/login');
const categoriesRoute = require('./routes/categories');

app.use(morgan('dev'));

const timersRoute = require('./routes/timers');

app.use(express.json());
app.use(express.urlencoded());

app.use('/timers', timersRoute);
app.use('/users', usersRoute);
app.use('/login', loginRoute);
app.use('/categories', categoriesRoute);
const port = 3000;

const dbOptions = require('./database/dbConst');

mongoose.connect(process.env.DBURL, dbOptions).then(() => {
  console.log("Connected to mongo");
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
