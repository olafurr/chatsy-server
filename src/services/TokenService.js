'use strict';

/* global CHError:tru */
/* jslint camelcase:false */

const BaseService = require('./base/BaseService');

((module) => {

    class TokenService extends BaseService {

        constructor() {
            super();

            this.revoke = this.revoke.bind(this);
            this.create = this.create.bind(this);
        }

        findAndUpdate(token) {
            this.models('token')
                .find({
                    token
                })
                .then((token) => {
                    if (!token) {
                        throw new CHError(401, 'Token not found');
                    }

                    if (token.isExpired()) {
                        return token.updateExpiry();
                    } else {
                        return token;
                    }
                });
        }

        create(userId) {
            return this
                .models('token')
                .createToken(userId)
                .then(this.serializer.token);
        }

        revoke(user_id) {
            return this
                .models('token')
                .destroy({
                    user_id
                });
        }
    }

    module.exports = new TokenService();
})(module);