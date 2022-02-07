const errors = require('../../common/errors');
const {
  apiKey,
  stripe: { secretKey },
} = require('../../configuration');

const authenticationService = {
  checkApiKey(req) {
    if (!req.headers || !req.headers['api-key'] || req.headers['api-key'] !== apiKey) {
      throw new errors.Unauthorized('API key not provided. Make sure you have a "api-key" as header.', 'INVALID_API_KEY');
    }
    return undefined;
  },
  checkStripeKey() {
    if (!secretKey) {
      throw new errors.Unauthorized('Stripe key not provided. Make sure you have a "STRIPE_SECRET_KEY" added in .env.yaml file.', 'INVALID_STRIPE_SECRET_KEY');
    }
    return undefined;
  },
};

function init() {
  return Object.assign(Object.create(authenticationService));
}

module.exports = init;
