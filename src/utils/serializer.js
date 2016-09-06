'use strict';

var Promise = require('bluebird'),
    _ = require('lodash');

var Mapper;
module.exports = Mapper = (function() {

    function compactObject(o) {
        _.each(o, function(v, k) {
            if (v === null || typeof v === 'undefined') {
                delete o[k];
            } else if (typeof v === 'object' && !Array.isArray(v) && v === Object(v) && Object.keys(v).length === 0 && !(v instanceof Date)) {
                delete o[k];
            }
        });
        return o;
    }

    var objects = {
        user: () => {
            return {
                id: 'id',
                created: 'created',
                updated: 'updated',
                email: 'email',
                username: 'username',
                online: 'online',
                'profilePicture': 'profile_picture_url'
            };
        },
        token: () => {
            return {
                token: 'token',
                expiry: 'expiry'
            };
        }
    };

    function serialize(obj, mapper, o) {
        Object.keys(mapper).forEach(function(key) {
            if (typeof mapper[key] === 'string') {
                var components = mapper[key].split('.');

                if (components.length === 1) {
                    o[key] = obj[mapper[key]];
                } else {
                    var runningObj = obj;
                    components.forEach(function(comp) {
                        if (typeof runningObj[comp] !== 'object') {
                            o[key] = runningObj[comp];
                        } else {
                            runningObj = runningObj[comp];
                        }
                    });

                }
            } else if (Array.isArray(mapper[key])) {
                var objKey = mapper[key][0];
                if (Array.isArray(obj[objKey])) {
                    o[key] = obj[objKey].map(function(x) {
                        return serialize(x, mapper[key][1].call(objects), {});
                    });
                } else if (typeof obj[objKey] !== 'undefined' && obj[objKey] !== null) {
                    o[key] = serialize(obj[objKey], mapper[key][1].call(objects), {});
                }

            } else if (typeof mapper[key] === 'object') {
                o[key] = {};
                serialize(obj, mapper[key], o[key]);
            } else if (typeof mapper[key] === 'function') {
                var value = mapper[key](obj);
                if (value !== null && typeof value !== 'undefined') {
                    o[key] = value;
                }
            }
        });

        return compactObject(o);
    }

    var _exports = {};

    Object.keys(objects).forEach(function(model) {
        _exports[model] = function(obj) {
            return serialize(obj, objects[model](), {});
        };
    });

    return _exports;
})();