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
      try {
        const charge = await client.charges.list(getFieldsToListCharges({
          created,
          customer,
          limit,
          source,
        }));
        return {
          data: charge,
        };
      } catch (error) {
        return handleStripeApiErrors(error);
      }
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
      try {
        const charge = await client.charges.create(removeUndefinedValues({
          amount,
          currency,
          capture,
          receipt_email,
          customer,
          description,
          metadata,
        }));
        return {
          data: charge,
        };
      } catch (error) {
        return handleStripeApiErrors(error);
      }
    },

    async get(chargeId) {
      try {
        const charge = await client.charges.retrieve(chargeId);
        return {
          data: charge,
        };
      } catch (error) {
        return handleStripeApiErrors(error);
      }
    },

    async update({
      chargeId,
      customer,
      description,
    }) {
      try {
        const charge = await client.charges.update(
          chargeId,
          getFieldsToUpdateCharge({
            customer,
            description,
          }),
        );
        return {
          data: charge,
        };
      } catch (error) {
        return handleStripeApiErrors(error);
      }
    },

    async capture(chargeId) {
      try {
        const charge = await client.charges.capture(chargeId);
        return {
          data: charge,
        };
      } catch (error) {
        return handleStripeApiErrors(error);
      }
    },
  },

  customers: {
    async list({
      created,
      email,
      limit,
    }) {
      try {
        const charge = await client.customers.list({
          created,
          email,
          limit,
        });
        return {
          data: charge,
        };
      } catch (error) {
        return handleStripeApiErrors(error);
      }
    },

    async create({
      source,
      email,
    }) {
      try {
        const customer = await client.customers.create(removeUndefinedValues({
          email,
          source,
        }));
        return {
          data: customer,
        };
      } catch (error) {
        return handleStripeApiErrors(error);
      }
    },

    async get(customerId) {
      try {
        const customer = await client.customers.retrieve(customerId);
        return {
          data: customer,
        };
      } catch (error) {
        return handleStripeApiErrors(error);
      }
    },

    async update({
      customerId,
      description,
      email,
      source,
    }) {
      try {
        const customer = await client.customers.update(
          customerId,
          {
            description,
            email,
            source,
          },
        );
        return {
          data: customer,
        };
      } catch (error) {
        return handleStripeApiErrors(error);
      }
    },

    async delete(customerId) {
      try {
        const customer = await client.customers.del(customerId);
        return {
          data: customer,
        };
      } catch (error) {
        return handleStripeApiErrors(error);
      }
    },
  },

  refunds: {
    async create({
      refundId,
      amount,
    }) {
      try {
        const refund = amount
          ? await client.refunds.create({
            charge: refundId,
            amount,
          })
          : await client.refunds.create({
            charge: refundId,
          });
        return {
          data: refund,
        };
      } catch (error) {
        return handleStripeApiErrors(error);
      }
    },

    async get(refundId) {
      try {
        const refund = await client.refunds.retrieve(refundId);
        return {
          data: refund,
        };
      } catch (error) {
        return handleStripeApiErrors(error);
      }
    },
  },
};

function init() {
  return Object.assign(Object.create(paymentsInterface));
}


module.exports.init = init;
