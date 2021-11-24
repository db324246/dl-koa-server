const { createMongo } = require('dl-node-mongo');
const CONFIG = require('../config/mongodConfig');

module.exports = createMongo(CONFIG)
