'use strict';

const express = require('express');
const socketIO = require('socket.io');
const Sequelize = require('sequelize');

// Server
const app = express();
const server = require('http').Server(app);
const io = socketIO(server);

// DB
const sequelizeClient = new Sequelize('chat_app', 'olafurgardarsson', null, {
    dialect: 'postgres'
});

// Bootstrap User model
const UserModel = require('./models/User')(sequelizeClient);
// Bootstrap api
require('./src/api')(app, UserModel);

// Boostrap socket
require('./src/socket')(io);

sequelizeClient.sync({
    force: true
}).then(() => {
    console.log('Server started on port 3030');
    server.listen(3030);
});