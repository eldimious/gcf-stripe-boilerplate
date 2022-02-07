const validator = require('validator');
const errors = require('../../common/errors');

const requestValidator = {
  isPostMethod(req) {
    if (req.method !== 'POST') {
      throw new errors.MethodNotAllowed('Only POST methods supported', 'BAD_REQUEST_METHOD');
    }
  },

  isGetMethod(req) {
    if (req.method !== 'GET') {
      throw new errors.MethodNotAllowed('Only GET methods supported', 'BAD_REQUEST_METHOD');
    }
  },

  isDeleteMethod(req) {
    if (req.method !== 'DELETE') {
      throw new errors.MethodNotAllowed('Only DELETE methods supported', 'BAD_REQUEST_METHOD');
    }
  },

  validateCreateChargeBody(req) {
    if (!req.body.customerId) {
      throw new errors.BadRequest('Customer Id not provided. Make sure you have a "customerId" property in your request body.');
    } else if (!req.body.amount || (req.body.amount && !validator.isDecimal(req.body.amount))) {
      throw new errors.BadRequest('Amount not provided. Make sure you have a "amount" property in your request body.');
    } else if (!req.body.currency) {
      throw new errors.BadRequest('Currency not provided. Make sure you have a "currency" property in your request body.');
    }
  },

  validateCreateCustomerBody(req) {
    if (!req.body.email || (req.body.email && !validator.isEmail(req.body.email))) {
      throw new errors.BadRequest('Email not provided. Make sure you have a "email" property in your request body.');
    } else if (!req.body.stripeToken) {
      throw new errors.BadRequest('StripeToken not provided. Make sure you have a "stripeToken" property in your request body.');
    }
  },

  validateGetCustomerQuery(req) {
    if (!req.query.customerId) {
      throw new errors.BadRequest('Customer id not provided. Make sure you have a "customerId" property in your request query params.');
    }
  },
};

function init() {
  return Object.assign(Object.create(requestValidator));
}

module.exports = init;
