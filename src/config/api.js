'use strict';

/* global CHError:true */
/* jshint unused:false */
/* jshint camelcase:false */

const redisClient = require('./redis');

module.exports = (app, service, wss) => {

    // Middlwares
    function ensureAuthorized(req, res, next) {

        if (!req.query.access_token) {
            return next(new CHError(401, 'Access token is required'));
        }

        service.token
            .findAndUpdate(req.query.access_token)
            .then(_ => next())
            .catch(err => next(new CHError(401, 'Unauthorized: ${err.message}')));
    }


    app.get('/blerty', (req, res) => {
        redisClient.get('debby', (err, data) => {

            wss.clients[0].send('Howdy ho');
            res.send('blert');
        });
    });

    // API
    app.post('/login', (req, res) => {

    });

    app.post('/logout', (req, res, next) => {
        service.token
            .revoke(req.profile.id)
            .then(_ => res.send({
                message: 'Successfully logged out.'
            }))
            .catch(err => next(new CHError(`Error logging out: ${err.message}`)));
    });

    app.post('/users', (req, res, next) => {
        if (!req.body.username) {
            return next(new CHError(400, `Username is required`));
        }

        if (!req.body.email) {
            return next(new CHError(400, `Email is required`));
        }

        if (!req.body.password) {
            return next(new CHError(400, `Password is required`));
        }

        service.user
            .create(req.body)
            .then(user => res.send({
                message: 'Successfully created user.',
                data: user
            }))
            .catch(err => next(new CHError(err.code || 500, `Error creating user: ${err.message}`)));
    });

    app.get('/users', (req, res, next) => {

    });

    app.use((err, req, res) => {
        res.status(err.code).send({
            message: err.message
        });
    });
};