const express = require('express');
const app = express();
const morgan = require('morgan');

const requestTimeOff = require ('./routes/requestTimeOff');

app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/requestTimeOff', requestTimeOff);

const port = 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
