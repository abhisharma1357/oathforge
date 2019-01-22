const accounts = require('./accounts')
const amorphNumber = require('amorph-number')
const oathForgeStub = require('./oathForgeStub')

module.exports = function testBalances(balances) {
  describe('balances', () => {
    balances.forEach((balance, index) => {
      it(`account ${index} should have balance of ${balance.to(amorphNumber.unsigned)}`, () => {
        return oathForgeStub.promise.then((oathForge) => {
          return oathForge.fetch('balanceOf(address)', [accounts[index].address]).should.eventually.amorphEqual(balance)
        })
      })
    })
  })
}
