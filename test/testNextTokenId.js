const accounts = require('./accounts')
const amorphNumber = require('amorph-number')
const oathForgeStub = require('./oathForgeStub')

module.exports = function testNextTokenId(nextTokenId) {
  describe('nextTokenId', () => {
    it(`should be ${nextTokenId.to(amorphNumber.unsigned)}`, () => {
      return oathForgeStub.promise.then((oathForge) => {
        return oathForge.fetch('nextTokenId()', []).should.eventually.amorphEqual(nextTokenId)
      })
    })
  })
}
