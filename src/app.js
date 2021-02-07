import express from 'express';
import logger from 'morgan';
import { config } from 'dotenv';
import errorHandler from './middleware/errorHandler';
import { NotFoundError } from './helpers/errors';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import authRouter from './routes/auth.route';
import listRouter from './routes/list.route';
import bodyParser from 'body-parser';
import cors from 'cors';

config()

const app = express();

if (['development', 'production'].includes(process.env.NODE_ENV)) {
  app.use(logger('dev'));
}

app.use(cors({
  origin: process.env.APP_ORIGIN
}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(mongoSanitize());
app.use(cookieParser());

passport.initialize();

app.use('/auth', authRouter);
app.use('/lists', listRouter);

app.all('*', (req, res) => {
  throw new NotFoundError('Resource not found on this server');
});

app.use(errorHandler);

export default app;
