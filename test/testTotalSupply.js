const accounts = require('./accounts')
const amorphNumber = require('amorph-number')
const gcnft0Stub = require('./gcnft0Stub')

module.exports = function testTotalSupply(totalSupply) {
  describe('total supply', () => {
    it(`should be ${totalSupply.to(amorphNumber.unsigned)}`, () => {
      return gcnft0Stub.promise.then((gcnft0) => {
        return gcnft0.fetch('totalSupply()', []).should.eventually.amorphEqual(totalSupply)
      })
    })
  })
}
