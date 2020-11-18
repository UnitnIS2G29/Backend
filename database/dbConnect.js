const mongoose = require('mongoose');

const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
};

function connect() {
    const db = mongoose.createConnection(`${process.env.DBURL}`, dbOptions); // mongodb://localhost:27017/is2g29
    db.on('connecting', () => console.log(`Connection to mongo...`));
    db.on('connected', () => {
          console.log(`Connected to mongo DB`);
        });
    db.on('error', () => {
          console.log(`Error connecting to mongo DB`);
          setTimeout(() => connect(), 5000);
        });
    return db;
}

const db = connect();

module.exports = db;

