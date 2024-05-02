const db = require('../src/dao/DBConnection');
const fs = require('fs');

const data = fs.readFileSync('./data/courses/ncsu.json');
const courses = JSON.parse(data);

// TODO: iterate through the data and insert it into the database
// ...