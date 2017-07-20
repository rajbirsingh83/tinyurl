'use strict';

const PORT = process.env.PORT || 3000;

const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();

const logger = require(path.join(__dirname, 'logger'));
const dbconn = require(path.join(__dirname, 'dbconn'));
const tinify = require(path.join(__dirname, 'src', 'controller', 'tinify'));
const redirect = require(path.join(__dirname, 'src', 'controller', 'redirect'));

// app variables
app.set('logger', logger);
app.set('tinyhost', 'localhost:3000');
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src', 'views'));

app.engine('handlebars', exphbs({
	defaultLayout: 'main',
	layoutsDir: path.join(__dirname, 'src', 'views', 'layouts'),
}));

// middlware
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// routes and controllers
app.get('/', function(req, res) {
	res.render('home');
});
app.get('/tinify/:url', tinify);
app.get('/:urlId', redirect);

app.listen(PORT, function() {
	// initialize db connection
	dbconn(app).then(() => {
		logger.log(`Server is listening at ${PORT}`);
	}).catch((err) => {
		logger.log(err);
	});
});