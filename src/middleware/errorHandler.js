import { config } from 'dotenv';
import debug from 'debug';

config();

const DEBUG = debug('dev');

export default (err, request, response, next) => {
  const isProd = process.env.NODE_ENV === 'production';
  let errorMessage = {};

  if (response.headersSent) {
    return next(err);
  }

  if (!isProd) {
    DEBUG(err.stack);
    errorMessage = err;
  }

  return response.status(err.statusCode || 500).json({
    status: err.statusCode || 500,
    error: {
      message: err.message,
      ...(err.errors && {errors: err.errors}),
      ...(!isProd && {trace: errorMessage})
    }
  });
}
