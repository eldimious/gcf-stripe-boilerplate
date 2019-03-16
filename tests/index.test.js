require('dotenv').config();
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const methods = require('../index.js');
const { mockRequest, mockResponse } = require('./data');
const {
  apiKey,
  stripe: { secretKey },
} = require('../configuration');
console.log(secretKey)
chai.use(chaiAsPromised);
const {
  expect,
} = chai;

let req;
let res;

describe('test exported methods', () => {
  beforeEach(() => {
    req = mockRequest();
    req.headers = {
      'origin': 'request.com',
      'access-control-request-headers': 'requestedHeader1,requestedHeader2'
    };
    res = mockResponse();
  });
  describe('test createCharge method', () => {
    it('should return wrong request method', async () => {
      req.method = 'GET';
      expect(typeof(methods.createCharge)).to.eql('function');
      await methods.createCharge(req, res);
      expect(res.code).to.eql(405);
      expect(res.message.data.message).to.eql('Only POST methods supported');
    });
    it('should return missing customerId error', async () => {
      req.method = 'POST';
      expect(typeof(methods.createCharge)).to.eql('function');
      await methods.createCharge(req, res);
      expect(res.code).to.eql(400);
      expect(res.message.data.message).to.eql('Customer Id not provided. Make sure you have a "customerId" property in your request body.');
    });
    it('should return missing amount error', async () => {
      req.method = 'POST';
      req.body = {
        customerId: 'test',
      };
      expect(typeof(methods.createCharge)).to.eql('function');
      await methods.createCharge(req, res);
      expect(res.code).to.eql(400);
      expect(res.message.data.message).to.eql('Amount not provided. Make sure you have a "amount" property in your request body.');
    });
    it('should return missing currency error', async () => {
      req.body = {
        customerId: 'test',
        amount: '10',
      };
      req.method = 'POST';
      expect(typeof(methods.createCharge)).to.eql('function');
      await methods.createCharge(req, res);
      expect(res.code).to.eql(400);
      expect(res.message.data.message).to.eql('Currency not provided. Make sure you have a "currency" property in your request body.');
    });
    it('should return missing ApiKey', async () => {
      req.method = 'POST';
      req.body = {
        customerId: 'test',
        amount: '10',
        currency: 'EUR',
      };
      expect(typeof(methods.createCharge)).to.eql('function');
      await methods.createCharge(req, res);
      expect(res.code).to.eql(401);
      expect(res.message.data.message).to.eql('API key not provided. Make sure you have a "api-key" as header.');
    });
    it('should return missing ApiKey', async () => {
      req.method = 'POST';
      req.headers['api-key'] = 'test';
      req.body = {
        customerId: 'test',
        amount: '10',
        currency: 'EUR',
      };
      expect(typeof(methods.createCharge)).to.eql('function');
      await methods.createCharge(req, res);
      expect(res.code).to.eql(401);
      expect(res.message.data.message).to.eql('API key not provided. Make sure you have a "api-key" as header.');
    });
    it('should return success', async () => {
      req.method = 'POST';
      req.headers['api-key'] = apiKey;
      req.body = {
        customerId: 'test',
        amount: '10',
        currency: 'EUR',
      };
      expect(typeof(methods.createCharge)).to.eql('function');
      await expect(methods.createCharge(req, res)).to.eventually.be.fulfilled;
    });
  });
  describe('test createCustomer method', () => {
    it('should return wrong request method', async () => {
      req.method = 'GET';
      expect(typeof(methods.createCustomer)).to.eql('function');
      await methods.createCustomer(req, res);
      expect(res.code).to.eql(405);
      expect(res.message.data.message).to.eql('Only POST methods supported');
    });
    it('should return missing email error', async () => {
      req.method = 'POST';
      expect(typeof(methods.createCustomer)).to.eql('function');
      await methods.createCustomer(req, res);
      expect(res.code).to.eql(400);
      expect(res.message.data.message).to.eql('Email not provided. Make sure you have a "email" property in your request body.');
    });
    it('should return missing stripeToken error', async () => {
      req.method = 'POST';
      req.body = {
        email: 'test@gmail.com',
      };
      expect(typeof(methods.createCustomer)).to.eql('function');
      await methods.createCustomer(req, res);
      expect(res.code).to.eql(400);
      expect(res.message.data.message).to.eql('StripeToken not provided. Make sure you have a "stripeToken" property in your request body.');
    });
    it('should return missing ApiKey', async () => {
      req.method = 'POST';
      req.body = {
        email: 'test@gmail.com',
        stripeToken: 'test'
      };
      expect(typeof(methods.createCustomer)).to.eql('function');
      await methods.createCustomer(req, res);
      expect(res.code).to.eql(401);
      expect(res.message.data.message).to.eql('API key not provided. Make sure you have a "api-key" as header.');
    });
    it('should return missing ApiKey', async () => {
      req.method = 'POST';
      req.headers['api-key'] = 'test';
      req.body = {
        email: 'test@gmail.com',
        stripeToken: 'test'
      };
      expect(typeof(methods.createCustomer)).to.eql('function');
      await methods.createCustomer(req, res);
      expect(res.code).to.eql(401);
      expect(res.message.data.message).to.eql('API key not provided. Make sure you have a "api-key" as header.');
    });
    it('should return success', async () => {
      req.method = 'POST';
      req.headers['api-key'] = apiKey;
      req.body = {
        email: 'test@gmail.com',
        stripeToken: 'test'
      };
      expect(typeof(methods.createCustomer)).to.eql('function');
      await expect(methods.createCustomer(req, res)).to.eventually.be.fulfilled;
    });
  });
});