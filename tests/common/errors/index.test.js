const chai = require('chai');
const errors = require('../../../common/errors');

const { expect } = chai;

describe('test exported error methods', () => {
  describe('test isCustomError method', () => {
    it('should return false', async () => {
      expect(typeof(errors.isCustomError)).to.eql('function');
      expect(errors.isCustomError(new Error('test'))).to.be.false;
    });
    it('should return true', async () => {
      expect(typeof(errors.isCustomError)).to.eql('function');
      expect(errors.isCustomError(new errors.InternalServerError('test'))).to.be.true;
    });
  });

  describe('test custom errors', () => {
    it('should return InternalServerError error constructor', async () => {
      expect(typeof(errors.InternalServerError)).to.eql('function');
      const err = new errors.InternalServerError('test');
      expect(err.message).to.eql('test');
      expect(err.status).to.eql(500);
    });
    it('should return Unauthorized error constructor', async () => {
      expect(typeof(errors.Unauthorized)).to.eql('function');
      const err = new errors.Unauthorized('test');
      expect(err.message).to.eql('test');
      expect(err.status).to.eql(401);
    });
  });
});
