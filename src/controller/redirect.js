'use strict';

const rethinkdb = require('rethinkdb');
const path = require('path');
const error = require(path.join(__dirname, '..', 'helpers', 'error'));

module.exports = function(req, res) {
	const urlId = req.params.urlId;
	const conn = req.app.get('dbconn');
	const getRow = rethinkdb.table('urls').get(urlId);

	getRow.run(conn).then((cursor) => {
		if (cursor && cursor.url) {
			getRow.update({
				accessedCount: cursor.accessedCount + 1,
				lastAccessedAt: Date.now(),
			}).run(conn).then(() => {
				res.redirect(cursor.url);
			}).catch(error(res));
		}
		else {
			res.status(500).send('Record not found');
		}
	}).catch(error(res));
};