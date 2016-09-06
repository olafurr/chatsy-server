'use strict';

/* jslint camelcase:false */

const crypto = require('crypto');

const SALT = '1114f5012eaf3d09216ea67f4ce56974';
// Two hours
const EXPIRY = 2 * 60 * 60 * 1000;

module.exports = (sequelize, DataTypes) => {
    const Token = sequelize.define('token', {
        token: {
            unique: true,
            type: DataTypes.STRING
        },
        expiry: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        createdAt: 'created',
        updatedAt: 'updated',
        classMethods: {
            associate: (m) => {
                Token.belongsTo(m.user, {
                    foreignKey: {
                        name: 'user_id'
                    }
                });
            },
            createToken: (user_id) => {
                const token = crypto.createHash('md5')
                    .update(SALT)
                    .digest('hex');

                const expiry = Date.getTime() + EXPIRY;

                return Token.create({
                    token,
                    user_id,
                    expiry
                });
            }
        },
        instanceMethods: {
            isExpired: function() {
                return new Date(this.expiry).getTime() < Date.getTime() + EXPIRY;
            },
            updateExpiry: function() {
                return this.updateAttributes({
                    expiry: Date.getTime() + EXPIRY
                });
            }
        }
    });


    return Token;
};