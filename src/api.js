'use strict';

module.exports = (app, models) => {

    app.post('/login', (req, res) => {

    });

    app.post('/users', (req, res) => {
        if (!req.body.username) {
            return res.status(400).send({
                error: 'Username is requried'
            });
        }

        models.User
            .create(req.body)
            .then(_ => res.send({
                message: 'Successfully created user.'
            }))
            .catch(err => res.status(500).send({
                error: err.message
            }));
    });

    app.get('/users', (req, res) => {
        models.User
            .find({})
            .map(u => u.toJSON())
            .then(users => res.send(users));
    });

};