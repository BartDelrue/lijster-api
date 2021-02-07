import http from 'http';
import debug from 'debug';
import { config } from 'dotenv';
import app from './app';
import './db/mongoose';

config();

const DEBUG = debug('dev');
const PORT = process.env.PORT || 3001;

const server = http.createServer(app);

process.on('uncaughtException', (error) => {
  DEBUG(`uncaught exception: ${error.message}`);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  DEBUG('Unhandled Rejection:', {
    name: err.name,
    message: err.message || err,
  });
  process.exit(1);
});

server.listen(PORT, () => DEBUG(`Mordilicious.api listening on port ${PORT} in ${process.env.NODE_ENV} mode`));
