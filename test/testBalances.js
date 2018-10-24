const accounts = require('./accounts')
const amorphNumber = require('amorph-number')
const gcnft0Stub = require('./gcnft0Stub')

module.exports = function testBalances(balances) {
  describe('balances', () => {
    balances.forEach((balance, index) => {
      it(`account ${index} should have balance of ${balance.to(amorphNumber.unsigned)}`, () => {
        return gcnft0Stub.promise.then((gcnft0) => {
          return gcnft0.fetch('balanceOf(address)', [accounts[index].address]).should.eventually.amorphEqual(balance)
        })
      })
    })
  })
}
