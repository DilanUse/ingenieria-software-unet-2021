const Promise = require('bluebird');
const userSeeder = require('../components/user/user.seeder');

class Seeders {
  constructor() {
    this.seeders = [
      userSeeder,
    ];
  }

  run() {
    // Promise.mapSeries(this.seeders, (seeder) => seeder.seed());
  }
}
const singletonInstance = new Seeders();

module.exports = singletonInstance;
