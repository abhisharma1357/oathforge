const accounts = require('./accounts')
const amorphNumber = require('amorph-number')
const oathForgeStub = require('./oathForgeStub')
const Amorph = require('amorph')
const FailedTransactionError = require('ultralightbeam/lib/errors/FailedTransaction')

const nullAddress = new Amorph((new Uint8Array(20).fill(0)))

module.exports = function testOwnerOf(tokenId, accountIndex) {
  it(`owner should be account ${accountIndex === null ? 'NULL' : accountIndex}`, () => {
    return oathForgeStub.promise.then((oathForge) => {
      if (accountIndex === null) {
        return oathForge.fetch('ownerOf(uint256)', [tokenId]).should.eventually.be.rejectedWith(FailedTransactionError)
      } else {
        return oathForge.fetch('ownerOf(uint256)', [tokenId]).should.eventually.amorphEqual(accounts[accountIndex].address)
      }
    })
  })
}
