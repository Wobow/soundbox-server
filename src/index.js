import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import initializeDb from './db';
import middleware from './middleware';
import api from './api';
import config from './config';
import passport from 'passport';
import APIError from './error';
import initializePassport from './passport-init';
import 'babel-polyfill';
import SocketHandler from './socket';
const app = express();

app.server = http.createServer(app);


// logger
app.use(morgan('dev'));

// 3rd party middleware
app.use(cors({
  exposedHeaders: config.corsHeaders, 
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/public',  express.static(__dirname + '/public'));
app.use(passport.initialize());
initializePassport();
initializeDb((db) => {
  app.use(middleware({ config, db }));
  app.use('/api', api({ config, db }));

  app.use(function(error, req, res, next) {
    APIError.from(error).send(res);
    next();
  });

  SocketHandler.start(app.server);
  
  app.server.listen(process.env.PORT || config.port, () => {
    console.log(`Started on port ${app.server.address().port}`);
  });
});

export default app;
