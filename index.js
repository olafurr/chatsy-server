'use strict';

const express = require('express');
const ws = require('ws');
const Sequelize = require('sequelize');

// Logger
const log = require('log4js').getLogger();

// Server
const app = express();
const server = require('http').Server(app);

// WebSocket
const wss = new ws.Server({
    server
});

// DB
const sequelizeClient = new Sequelize('chat_app', 'olafurgardarsson', null, {
    dialect: 'postgres'
});

// Expose CHError to the world 🌏
require('./src/utils/CHError');

// Create redis client
require('./src/config/redis');

// Bootstrap User model
require('./src/config/models').init(sequelizeClient);

// Boostrap socket
require('./src/config/socket')(wss);

// Bootstrap server
require('./src/config/server')(app);

const services = require('./src/config/services');

// Bootstrap api
require('./src/config/api')(app, services, wss);

const PORT = process.env.PORT || 3030;

sequelizeClient.sync({
    force: true
}).then(() => {
    log.info(`Connected to postgres`);
    // jshint unused:false
    server.listen(PORT, _ => log.info(`Server started on port ${PORT} => 🌏`));
});