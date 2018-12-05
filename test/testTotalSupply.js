const accounts = require('./accounts')
const amorphNumber = require('amorph-number')
const gc0Stub = require('./gc0Stub')

module.exports = function testTotalSupply(totalSupply) {
  describe('totalSupply', () => {
    it(`should be ${totalSupply.to(amorphNumber.unsigned)}`, () => {
      return gc0Stub.promise.then((gc0) => {
        return gc0.fetch('totalSupply()', []).should.eventually.amorphEqual(totalSupply)
      })
    })
  })
}
