'use strict';

const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const User = sequelize.define('user', {
        username: {
            unique: true,
            type: Sequelize.STRING
        },
        password: Sequelize.STRING
    });

    return User;
};