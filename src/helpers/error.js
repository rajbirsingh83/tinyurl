'use strict';

const path = require('path');
const logger = require(path.join(__dirname, '..', '..', 'logger'));

module.exports = function(res) {
	return function(error) {
		logger.log(error);
		res.status(500).send(error);
	}
};