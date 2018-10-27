const accounts = require('./accounts')
const amorphNumber = require('amorph-number')
const gcnft0Stub = require('./gcnft0Stub')
const Amorph = require('amorph')
const FailedTransactionError = require('ultralightbeam/lib/errors/FailedTransaction')

const nullAddress = new Amorph((new Uint8Array(20).fill(0)))

module.exports = function testOwnerOf(tokenId, accountIndex) {
  it(`owner should be account ${accountIndex === null ? 'NULL' : accountIndex}`, () => {
    return gcnft0Stub.promise.then((gcnft0) => {
      if (accountIndex === null) {
        return gcnft0.fetch('ownerOf(uint256)', [tokenId]).should.eventually.be.rejectedWith(FailedTransactionError)
      } else {
        return gcnft0.fetch('ownerOf(uint256)', [tokenId]).should.eventually.amorphEqual(accounts[accountIndex].address)
      }
    })
  })
}
