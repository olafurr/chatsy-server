'use strict';

/* jslint camelcase:false */

const url = require('url');
const log = require('log4js').getLogger();

const redisClient = require('./redis');

module.exports = (wss) => {

    wss.on('connection', (socket) => {
        // Write socket to redis

        log.debug('New client connected');

        const query = url.parse(socket.upgradeReq.url, true).location;

        if (query && query.userId) {
            const userId = query.user_id;

            // jshint unused:false
            redisClient.set('user:socket:${userId}', JSON.stringify(socket), _ => {
                log.debug(`Saved socket for user_id: ${userId}`);
            });
        }

        socket.on('open', _ => log.info(`New client connected with id: ${userId}`));

        // Only for debugging
        socket.on('message', text => log.info(`Recieved message: ${text}`));
    });
};