require('dotenv').config();
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const methods = require('../index.js');
const { mockRequest, mockResponse } = require('./data');
const {
  apiKey,
} = require('../configuration');

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
  });

});