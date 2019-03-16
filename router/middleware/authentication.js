const errors = require('../../common/errors');
const {
  apiKey,
} = require('../../configuration');


const authenticationService = {
  checkApiKey(req) {
    try {
      if (!req.headers || !req.headers['api-key'] || req.headers['api-key'] !== apiKey) {
        throw new errors.Unauthorized('API key not provided. Make sure you have a "api-key" as header.', 'INVALID_API_KEY');
      }
      return undefined;
    } catch (error) {
      throw error;
    }
  },
};

function init() {
  return Object.assign(Object.create(authenticationService));
}

module.exports = init;
