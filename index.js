const cors = require('cors')();
const errorHandler = require('./router/middleware/errorHandler');
const stripeInterfaceModule = require('./data/repositories/stripe');
const chargesServicesModule = require('./domain/charges');
const customersServicesModule = require('./domain/customers');
const validatorMiddleware = require('./router/middleware/requestValidator');
const authenticationMiddleware = require('./router/middleware/authentication');

const validator = validatorMiddleware();
const authentication = authenticationMiddleware();
const stripeInterface = stripeInterfaceModule.init();
const chargesServices = chargesServicesModule.init(stripeInterface);
const customersServices = customersServicesModule.init(stripeInterface);

exports.createCharge = async function createCharge(req, res) {
  return cors(req, res, async() => {
    try {
      validator.checkReqPostMethod(req, res);
      validator.requireValidParamsToCreateCharge(req, res);
      authentication.checkApiKey(req);
      authentication.checkStripeKey(req);
      const response = await chargesServices.create({
        amount: req.body.amount,
        currency: req.body.currency,
        receipt_email: req.body.receipt_email,
        customer: req.body.customerId,
        capture: req.body.capture || true,
        description: req.body.description,
        metadata: req.body.metadata,
      });
      return res.status(200).send(response);
    } catch (error) {
      return errorHandler(res, error);
    }
  });
};

exports.createCustomer = async function createCustomer(req, res) {
  return cors(req, res, async() => {
    try {
      validator.checkReqPostMethod(req, res);
      validator.requireValidParamsToCreateCustomer(req, res);
      authentication.checkApiKey(req);
      authentication.checkStripeKey(req);
      const response = await customersServices.create({
        email: req.body.email,
        source: req.body.stripeToken,
      });
      return res.status(200).send(response);
    } catch (error) {
      return errorHandler(res, error);
    }
  });
};

exports.getCustomer = async function getCustomer(req, res) {
  return cors(req, res, async() => {
    try {
      validator.checkReqGetMethod(req, res);
      validator.requireValidParamsForGetCustomer(req, res);
      authentication.checkApiKey(req);
      authentication.checkStripeKey(req);
      const response = await customersServices.get(req.query.customerId);
      return res.status(200).send(response);
    } catch (error) {
      return errorHandler(res, error);
    }
  });
};

exports.removeCustomer = async function removeCustomer(req, res) {
  return cors(req, res, async() => {
    try {
      validator.checkReqDeleteMethod(req, res);
      validator.requireValidParamsForGetCustomer(req, res);
      authentication.checkApiKey(req);
      authentication.checkStripeKey(req);
      const response = await customersServices.remove(req.query.customerId);
      return res.status(200).send(response);
    } catch (error) {
      return errorHandler(res, error);
    }
  });
};
