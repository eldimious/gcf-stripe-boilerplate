const stripe = require('stripe');
const { stripe: stripeConfig } = require('../../../configuration');

const client = stripe(stripeConfig.secretKey);


const getFieldsToUpdateCharge = ({
  customer,
  description,
}) => ({
  ...(customer && { customer }),
  ...(description && { description }),
});


const getFieldsToListCharges = ({
  created,
  customer,
  limit,
  source,
}) => ({
  ...(created && { created }),
  ...(customer && { customer }),
  ...(limit && { limit }),
  ...(source && { source }),
});


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
