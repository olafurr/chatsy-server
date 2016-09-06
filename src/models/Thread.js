'use strict';

module.exports = (sequelize, DataTypes) => {
    const Thread = sequelize.define('thread', {
        name: {
            type: DataTypes.STRING
        }
    }, {
        createdAt: 'created',
        updatedAt: 'updated'
    });

    return Thread;
};