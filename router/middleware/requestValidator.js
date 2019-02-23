const validator = require('validator');
const errors = require('../../common/errors');


const requestValidator = {
  checkReqPostMethod(req) {
    try {
      if (req.method !== 'POST') {
        throw new errors.MethodNotAllowed('Only POST methods supported', 'BAD_REQUEST_METHOD');
      }
      return undefined;
    } catch (error) {
      throw error;
    }
  },

  checkReqGetMethod(req) {
    try {
      if (req.method !== 'GET') {
        throw new errors.MethodNotAllowed('Only GET methods supported', 'BAD_REQUEST_METHOD');
      }
      return undefined;
    } catch (error) {
      throw error;
    }
  },

  checkReqDeleteMethod(req) {
    try {
      if (req.method !== 'DELETE') {
        throw new errors.MethodNotAllowed('Only DELETE methods supported', 'BAD_REQUEST_METHOD');
      }
      return undefined;
    } catch (error) {
      throw error;
    }
  },

  requireValidParamsForChargeCustomer(req) {
    try {
      if (!req.body.customerId) {
        throw new errors.BadRequest('customerId in body required.');
      } else if (!req.body.amount || (req.body.amount && !validator.isDecimal(req.body.amount))) {
        throw new errors.BadRequest('amount in body required.');
      } else if (!req.body.currency) {
        throw new errors.BadRequest('add a supported currency.');
      }
      return undefined;
    } catch (error) {
      throw error;
    }
  },

  requireValidParamsForCreateCustomer(req) {
    try {
      if (!req.body.email || (req.body.email && !validator.isEmail(req.body.email))) {
        throw new errors.BadRequest('amount in body required.');
      } else if (!req.body.stripeToken) {
        throw new errors.BadRequest('stripeToken in body required.');
      }
      return undefined;
    } catch (error) {
      throw error;
    }
  },

  requireValidParamsForGetCustomer(req) {
    try {
      if (!req.query.customerId) {
        throw new errors.BadRequest('customerId in query params required.');
      }
      return undefined;
    } catch (error) {
      throw error;
    }
  },
};

function init() {
  return Object.assign(Object.create(requestValidator));
}


module.exports = init;
