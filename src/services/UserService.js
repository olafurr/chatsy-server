'use strict';

const BaseService = require('./base/BaseService');

((module) => {

    class UserService extends BaseService {

        constructor(data) {
            super(data);

            this.findById = this.findById.bind(this);
            this.create = this.create.bind(this);
            this.updateVisibility = this.updateVisibility.bind(this);
        }

        findById(userId) {
            return this.models('user')
                .findById(userId)
                .then(u => u.toJSON())
                .then(this.serializer.user);
        }

        create(data) {
            return this.models('user').create({
                    username: data.username,
                    email: data.email,
                    password: data.password
                })
                .then(u => this.findById(u.id));
        }

        updateVisibility(userId, online) {
            return this.models('user')
                .findById(userId)
                .tap(u => u.updateAttributes({
                    online: online
                }))
                .then(u => u.toJSON())
                .then((u) => {
                    u.online = online;
                    return u;
                })
                .then(this.serializer.user);
        }
    }

    module.exports = new UserService();
})(module);