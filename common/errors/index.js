const httpErrors = require('throw-http-errors');

const isCustomError = (error) => {
  if (Object.keys(httpErrors).includes(error.name) || (error.status && Object.keys(httpErrors).includes(error.status.toString()))) {
    return true;
  }
  return false;
};

const handleDeltaErrors = (error) => {
  if (error && error.response && error.response.data) {
    const err = Object.assign({}, error);
    err.message = error.response.data ? error.response.data : error.message;
    err.status = error.response.status;
    throw err;
  } else if (error.request) {
    const err = new Error(error.request);
    throw err;
  } else if (isCustomError(error)) {
    throw error;
  }
  throw new Error(error);
};

module.exports = Object.assign(
  {},
  httpErrors,
  {
    isCustomError,
    handleDeltaErrors,
  },
);
