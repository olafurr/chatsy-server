'use strict';

function CHError(statusCode, message) {

    this.name = 'APIError';
    this.code = statusCode;
    this.message = message;
    this.stack = (new Error()).stack;
}

CHError.prototype = Object.create(Error.prototype);
CHError.prototype.constructor = CHError;

global.CHError = CHError;