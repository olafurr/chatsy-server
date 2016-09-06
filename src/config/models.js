'use strict';

const fs = require('fs'),
	path = require('path'),
	logger = require('log4js').getLogger();

const modelsPath = path.resolve(__dirname + '/../models');

module.exports = (function() {

	var db = {};

	return {
		init: function(sequelize) {
			fs
				.readdirSync(modelsPath)
				.filter(function(file) {
					return (file.indexOf('.') !== 0) &&
						(file !== path.basename(module.filename) &&
							!(fs.lstatSync(path.resolve(modelsPath + '/' + file)).isDirectory()));
				})
				.forEach(function(file) {
					var model = sequelize.import(path.join(modelsPath, file));
					logger.debug('Registering model:', file);
					db[model.name] = model;
				});
			console.log('');

			Object.keys(db).forEach(function(modelName) {
				if ('associate' in db[modelName]) {
					db[modelName].associate(db);
				}
			});

			this.sequelize = sequelize;
		},
		model: function(m) {
			return db[m];
		}
	};

})();