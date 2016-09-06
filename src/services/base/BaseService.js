'use strict';

const models = require('../../config/models');
const serializer = require('../../utils/serializer');

class BaseService {
    constructor() {
        this.models = models.model;
        this.serializer = serializer;
    }
}

module.exports = BaseService;