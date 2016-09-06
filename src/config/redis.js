'use strict';

const redis = require('redis');
const log = require('log4js').getLogger();

const redisClient = redis.createClient();

redisClient.on('connect', _ => log.info('Connected to redis'));

module.exports = redisClient;