const accounts = require('./accounts')
const amorphNumber = require('amorph-number')
const gc0Stub = require('./gc0Stub')

module.exports = function testBalances(balances) {
  describe('balances', () => {
    balances.forEach((balance, index) => {
      it(`account ${index} should have balance of ${balance.to(amorphNumber.unsigned)}`, () => {
        return gc0Stub.promise.then((gc0) => {
          return gc0.fetch('balanceOf(address)', [accounts[index].address]).should.eventually.amorphEqual(balance)
        })
      })
    })
  })
}
