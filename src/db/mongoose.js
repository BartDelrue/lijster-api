import mongoose from 'mongoose';
import { config } from 'dotenv';
import debug from 'debug';

config();
const DEBUG = debug('dev');
const {NODE_ENV, DEV_DB} = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
};

mongoose.connect(DEV_DB, options)
  .then(() => DEBUG(`MongoDB connected ${DEV_DB}`))
  .catch(err => DEBUG(err));
