'use strict';

const DB_PORT = process.env.DB_PORT || 28015;
const rethinkdb = require('rethinkdb');

module.exports = function(app) {
	const logger = app.get('logger');

	return new Promise(function(resolve, reject) {
		rethinkdb.connect({
			host: 'localhost',
			port: DB_PORT
		}, function(err, conn) {
			if(err) {
				reject();
			}
			logger.log(`Rethinkdb connected at ${DB_PORT}`);
			rethinkdb.dbCreate('TinyURL').run(conn).catch(() => {
				logger.log('Skipping db create as it already exists');
			}).done(() => {
				conn.use('TinyURL');
				app.set('dbconn', conn);
				rethinkdb.tableCreate('urls').run(conn).catch(() => {
					logger.log('Skipping table create as it already exists');
				}).done(() => {
					resolve()
				});
			});
		});
	});
};
