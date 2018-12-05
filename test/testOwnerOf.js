const accounts = require('./accounts')
const amorphNumber = require('amorph-number')
const gc0Stub = require('./gc0Stub')
const Amorph = require('amorph')
const FailedTransactionError = require('ultralightbeam/lib/errors/FailedTransaction')

const nullAddress = new Amorph((new Uint8Array(20).fill(0)))

module.exports = function testOwnerOf(tokenId, accountIndex) {
  it(`owner should be account ${accountIndex === null ? 'NULL' : accountIndex}`, () => {
    return gc0Stub.promise.then((gc0) => {
      if (accountIndex === null) {
        return gc0.fetch('ownerOf(uint256)', [tokenId]).should.eventually.be.rejectedWith(FailedTransactionError)
      } else {
        return gc0.fetch('ownerOf(uint256)', [tokenId]).should.eventually.amorphEqual(accounts[accountIndex].address)
      }
    })
  })
}
