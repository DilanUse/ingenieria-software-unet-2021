const db = require('mongoose');
const castAggregation = require('mongoose-cast-aggregation');

db.plugin(castAggregation);
const { config } = require('../config');

db.Promise = global.Promise;

// CONNECT DB WITH MONGOOSE
const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);

async function connect() {
  let url = '';

  if (config.dev === false) {
    url = `mongodb+srv://${USER}:${PASSWORD}@${config.dbHost}/${config.dbName}?retryWrites=true&w=majority`;
  } else if (config.dev === true) {
    if (process.env.MONGO_URL) {
      url = process.env.MONGO_URL;
    } else if (config.databaseUse === 'LOCAL') {
      url = `mongodb://localhost:27017/${config.dbName}`;
    } else if (config.databaseUse === 'REMOTE') {
      url = `mongodb+srv://${USER}:${PASSWORD}@${config.dbHost}/${config.dbName}?retryWrites=true&w=majority`;
    }
  }

  try {
    console.log('db connection url', url);

    await db.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('db connection successfully!');
  } catch (err) {
    console.log('db connection url', url);
    console.log('db connection error', err);
  }
}

module.exports = connect;
