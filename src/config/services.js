'use strict';

const fs = require('fs'),
    path = require('path'),
    logger = require('log4js').getLogger();

const servicePath = path.resolve(__dirname + '/../services');

module.exports = (function() {

    var services = {};

    fs
        .readdirSync(servicePath)
        .filter(function(file) {
            return (file.indexOf('.') !== 0) &&
                (file !== path.basename(module.filename) &&
                    !(fs.lstatSync(path.resolve(servicePath + '/' + file)).isDirectory()));
        })
        .forEach(function(file) {
            const service = require(path.join(servicePath, file));
            const serviceName = file.split('.')[0].split('Service')[0].toLowerCase();
            logger.debug('Registering service:', serviceName);
            services[serviceName] = service;
        });

    return services;
})();