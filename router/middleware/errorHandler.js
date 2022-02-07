const errors = require('../../common/errors');

const createResponseError = (err) => ({
  status: err.status,
  data: {
    code: err.code,
    message: err.message,
  },
});

const errorHandler = function errorHandler(res, err) {
  if (errors.isCustomError(err)) {
    return res.status(err.status).send(createResponseError(err));
  }
  const msg = err && err.message ? err.message : 'Internal Server Error';
  const internalError = new errors.InternalServerError(msg);
  return res.status(internalError.status).send(createResponseError(internalError));
};

module.exports = errorHandler;
