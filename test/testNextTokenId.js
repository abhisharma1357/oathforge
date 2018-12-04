const accounts = require('./accounts')
const amorphNumber = require('amorph-number')
const gcnft0Stub = require('./gcnft0Stub')

module.exports = function testNextTokenId(nextTokenId) {
  describe('nextTokenId', () => {
    it(`should be ${nextTokenId.to(amorphNumber.unsigned)}`, () => {
      return gcnft0Stub.promise.then((gcnft0) => {
        return gcnft0.fetch('nextTokenId()', []).should.eventually.amorphEqual(nextTokenId)
      })
    })
  })
}
