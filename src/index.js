const express = require('express');

const logger = require('morgan');

const cookieParser = require('cookie-parser');

const bodyParser = require('body-parser');

const users = require('./routes/users');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/users', users);

app.listen(8080);
