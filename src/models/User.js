'use strict';

/* jslint camelcase:false */

const crypto = require('crypto');
const gravatar = require('gravatar');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        username: {
            unique: true,
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            unique: true,
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        profile_picture_url: DataTypes.STRING,
        online: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        }
    }, {
        createdAt: 'created',
        updatedAt: 'updated',
        classMethods: {
            associate: (m) => {
                User.hasOne(m.message, {
                    foreignKey: {
                        name: 'user_id'
                    }
                });
            }
        }
    });

    User.beforeCreate((user) => {
        const hash = crypto.createHash('md5')
            .update(user.password)
            .digest('hex');
        user.password = hash;
        user.profile_picture_url = gravatar.url(user.email);
    });

    return User;
};