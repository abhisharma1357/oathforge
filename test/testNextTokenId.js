const accounts = require('./accounts')
const amorphNumber = require('amorph-number')
const gc0Stub = require('./gc0Stub')

module.exports = function testNextTokenId(nextTokenId) {
  describe('nextTokenId', () => {
    it(`should be ${nextTokenId.to(amorphNumber.unsigned)}`, () => {
      return gc0Stub.promise.then((gc0) => {
        return gc0.fetch('nextTokenId()', []).should.eventually.amorphEqual(nextTokenId)
      })
    })
  })
}
