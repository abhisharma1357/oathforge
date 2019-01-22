const accounts = require('./accounts')
const amorphNumber = require('amorph-number')
const oathForgeStub = require('./oathForgeStub')

module.exports = function testTotalSupply(totalSupply) {
  describe('totalSupply', () => {
    it(`should be ${totalSupply.to(amorphNumber.unsigned)}`, () => {
      return oathForgeStub.promise.then((oathForge) => {
        return oathForge.fetch('totalSupply()', []).should.eventually.amorphEqual(totalSupply)
      })
    })
  })
}
