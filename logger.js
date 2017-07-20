'use strict';

module.exports = function() {
	return {
		log: function() {
			console.log.apply(this, arguments);
		},
	};
}();