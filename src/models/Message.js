'use strict';

module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define('message', {
        text: {
            type: DataTypes.TEXT
        }
    }, {
        createdAt: 'created',
        updatedAt: 'updated',
        classMethods: {
            associate: (m) => {
                Message.belongsTo(m.thread, {
                    foreignKey: {
                        name: 'thread_id'
                    }
                });

                Message.belongsTo(m.user, {
                    foreignKey: {
                        name: 'user_id'
                    }
                });
            }
        }
    });

    return Message;
};