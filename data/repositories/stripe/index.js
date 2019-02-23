const stripe = require('stripe');
const { stripe: stripeConfig } = require('../../../configuration');

const client = stripe(stripeConfig);

const handleStripeApiErrors = (error) => {
  switch (error.type) {
    case 'StripeCardError':
      // A declined card error
      throw error;
    case 'StripeInvalidRequestError':
      // Invalid parameters were supplied to Stripe's API
      throw error;
    case 'StripeAPIError':
      // An error occurred internally with Stripe's API
      throw error;
    case 'StripeConnectionError':
      // Some kind of error occurred during the HTTPS communication
      throw error;
    case 'StripeAuthenticationError':
      // You probably used an incorrect API key
      throw error;
    case 'StripeRateLimitError':
      // Too many requests hit the API too quickly
      throw error;
    default:
      throw error;
  }
};


const getFieldsToUpdateCharge = ({
  customer,
  description,
}) => {
  const fields = {};
  if (customer) {
    fields.customer = customer;
  }
  if (description) {
    fields.description = description;
  }
  return fields;
};


const getFieldsToListCharges = ({
  created,
  customer,
  limit,
  source,
}) => {
  const fields = {};
  if (customer) {
    fields.customer = customer;
  }
  if (created) {
    fields.created = created;
  }
  if (limit) {
    fields.limit = limit;
  }
  if (source) {
    fields.source = source;
  }
  return fields;
};


const removeUndefinedValues = (obj) => {
  const updatedObj = Object.assign({}, obj);
  Object.keys(updatedObj).forEach(key => (!updatedObj[key]) && delete updatedObj[key]);
  return updatedObj;
};


const paymentsInterface = {
  charges: {
    async list({
      created,
      customer,
      limit,
      source,
    }) {
      return client.charges.list(getFieldsToListCharges({
        created,
        customer,
        limit,
        source,
      }));
    },

    async create({
      amount,
      currency,
      capture,
      receipt_email,
      customer,
      description,
      metadata,
    }) {
      return client.charges.create(removeUndefinedValues({
        amount,
        currency,
        capture,
        receipt_email,
        customer,
        description,
        metadata,
      }));
    },

    async get(chargeId) {
      return client.charges.retrieve(chargeId);
    },

    async update({
      chargeId,
      customer,
      description,
    }) {
      return client.charges.update(
        chargeId,
        getFieldsToUpdateCharge({
          customer,
          description,
        }),
      );
    },

    async capture(chargeId) {
      return client.charges.capture(chargeId);
    },
  },

  customers: {
    async list({
      created,
      email,
      limit,
    }) {
      return client.customers.list({
        created,
        email,
        limit,
      });
    },

    async create({
      source,
      email,
    }) {
      return client.customers.create(removeUndefinedValues({
        email,
        source,
      }));
    },

    async get(customerId) {
      return client.customers.retrieve(customerId);
    },

    async update({
      customerId,
      description,
      email,
      source,
    }) {
      return client.customers.update(
        customerId,
        {
          description,
          email,
          source,
        },
      );
    },

    async delete(customerId) {
      return client.customers.del(customerId);
    },
  },

  refunds: {
    async create({
      refundId,
      amount,
    }) {
      return amount
        ? client.refunds.create({
          charge: refundId,
          amount,
        })
        : client.refunds.create({
          charge: refundId,
        });
    },

    async get(refundId) {
      return client.refunds.retrieve(refundId);
    },
  },
};

function init() {
  return Object.assign(Object.create(paymentsInterface));
}


module.exports.init = init;
