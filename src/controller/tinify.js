'use strict';

const base64 = require('base-64');
const rethinkdb = require('rethinkdb');
const validURL = require('valid-url');
const path = require('path');
const error = require(path.join(__dirname, '..', 'helpers', 'error'));

function encodeUrl(url) {
	return base64.encode(url).replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
}

module.exports = function(req, res) {
	const url = req.params.url || '';
	const conn = req.app.get('dbconn');
	const logger = req.app.get('logger');
	const tinyhost = req.app.get('tinyhost');

	if (validURL.isWebUri(url)) {
		const urlId = encodeUrl(url);

		rethinkdb.table('urls').get(urlId).run(conn).then((cursor) => {
			const response = {
				tinyURL: tinyhost + '/' + urlId,
			};
			const timestamp = Date.now();
			if (cursor === null) {
				rethinkdb.table('urls').insert({
					id: urlId,
					url: url,
					accessedCount: 0,
					createdAt: timestamp,
					lastAccessedAt: timestamp,
				}).run(conn).then(() => {
					res.json(response);
				}).catch(error(res));
			}
			else {
				logger.log('Tiny url already exists for ' + url);
				res.json(response);
			}
		}).catch(error(res));
	}
	else {
		res.status(404).send('Invalid url');
	}
};