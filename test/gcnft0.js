const ultralightbeam = require('./ultralightbeam')
const gcnft0Info = require('../')
const Amorph = require('amorph')
const amorphNumber = require('amorph-number')
const accounts = require('./accounts')
const FailedTransactionError = require('ultralightbeam/lib/errors/FailedTransaction')
const getRandomAmorph = require('ultralightbeam/lib/getRandomAmorph')
const BluebirdStub = require('bluebird-stub')
const testBalances = require('./testBalances')
const testOwner = require('./testOwner')
const testTotalSupply = require('./testTotalSupply')
const gcnft0Stub = require('./gcnft0Stub')
const amorphAscii = require('amorph-ascii')

describe('gcnft0', () => {

  const name = Amorph.from(amorphAscii, 'GuildCrypt NFT 0')
  const symbol = Amorph.from(amorphAscii, 'GCNFT0')

  const zero = Amorph.from(amorphNumber.unsigned, 0)
  const one = Amorph.from(amorphNumber.unsigned, 1)
  const empty = new Amorph((new Uint8Array(32)).fill(0))
  const redemptionCodeHash = getRandomAmorph(32)

  const tokenAId = getRandomAmorph(32)

  let gcnft0

  describe('deploy', () => {
    it('should deploy', () => {
      return ultralightbeam.solDeploy(gcnft0Info.code, gcnft0Info.abi, [name, symbol], {
        from: accounts[0]
      }).then((_gcnft0) => {
        gcnft0 = _gcnft0
        gcnft0Stub.resolve(gcnft0)
      })
    })
    it('should have correct code', () => {
      return ultralightbeam.eth.getCode(gcnft0.address).should.eventually.amorphEqual(gcnft0Info.runcode)
    })
    it('should have correct name', () => {
      return gcnft0.fetch('name()', []).should.eventually.amorphEqual(name)
    })
    it('should have correct symbol', () => {
      return gcnft0.fetch('symbol()', []).should.eventually.amorphEqual(symbol)
    })
    testOwner(tokenAId, null)
    testBalances([zero, zero, zero, zero])
    testTotalSupply(zero)
  })
  /**************************************/
  describe('account 0 should mint tokenA to account 1', () => {
    it('should broadcast', () => {
      return gcnft0.broadcast('mint(uint256,address)', [tokenAId, accounts[1].address], {
        from: accounts[0]
      }).getConfirmation()
    })
    testOwner(tokenAId, 1)
    testBalances([zero, one, zero, zero])
    testTotalSupply(one)
  })
  describe('account 0 should NOT BE ABLE TO transfer tokenA from account 0 to account 2', () => {
    it('should REJECT broadcast', () => {
      return gcnft0.broadcast('transferFrom(address,address,uint256)', [accounts[0].address, accounts[2].address, tokenAId], {
        from: accounts[0]
      }).getConfirmation().should.be.rejectedWith(FailedTransactionError)
    })
    testOwner(tokenAId, 1)
    testBalances([zero, one, zero, zero])
    testTotalSupply(one)
  })
  describe('account 0 should NOT BE ABLE TO transfer tokenA from account 1 to account 2', () => {
    it('should REJECT broadcast', () => {
      return gcnft0.broadcast('transferFrom(address,address,uint256)', [accounts[1].address, accounts[2].address, tokenAId], {
        from: accounts[0]
      }).getConfirmation().should.be.rejectedWith(FailedTransactionError)
    })
    testOwner(tokenAId, 1)
    testBalances([zero, one, zero, zero])
  })
  describe('account 1 should transfer tokenA from account 1 to account 2', () => {
    it('should broadcast', () => {
      return gcnft0.broadcast('transferFrom(address,address,uint256)', [accounts[1].address, accounts[2].address, tokenAId], {
        from: accounts[1]
      }).getConfirmation()
    })
    testOwner(tokenAId, 2)
    testBalances([zero, zero, one, zero])
  })
  describe('account 2 should NOT BE ABLE TO sunset tokenA', () => {
    it('should REJECT broadcast', () => {
      return gcnft0.broadcast('initiateSunset(uint256)', [tokenAId], {
        from: accounts[2]
      }).getConfirmation().should.be.rejectedWith(FailedTransactionError)
    })
    it('sunset initiated at should be 0', () => {
      return gcnft0.fetch('sunsetInitiatedAt(uint256)', [tokenAId]).should.eventually.amorphEqual(zero)
    })
    testOwner(tokenAId, 2)
    testBalances([zero, zero, one, zero])
  })
  describe('account 0 should sunset tokenA', () => {
    it('should broadcast', () => {
      return gcnft0.broadcast('initiateSunset(uint256)', [tokenAId], {
        from: accounts[0]
      }).getConfirmation()
    })
    it('sunset initiated at should be latest block timestamp', () => {
      return gcnft0.fetch('sunsetInitiatedAt(uint256)', [tokenAId]).then((sunsetInitiatedAt) => {
        return ultralightbeam.getLatestBlock().then((block) => {
          block.timestamp.should.amorphEqual(sunsetInitiatedAt)
        })
      })
    })
    testOwner(tokenAId, 2)
    testBalances([zero, zero, one, zero])
    testTotalSupply(one)
  })
  describe('account 2 should transfer tokenA from account 2 to account 3', () => {
    it('should broadcast', () => {
      return gcnft0.broadcast('transferFrom(address,address,uint256)', [accounts[2].address, accounts[3].address, tokenAId], {
        from: accounts[2]
      }).getConfirmation()
    })
    testOwner(tokenAId, 3)
    testBalances([zero, zero, zero, one])
    testTotalSupply(one)
  })
  describe('account 0 should NOT BE ABLE TO submit redemption code hash', () => {
    it('should REJECT broadcast', () => {
      return gcnft0.broadcast('submitRedemptionCodeHash(uint256,bytes32)', [tokenAId, redemptionCodeHash], {
        from: accounts[0]
      }).getConfirmation().should.be.rejectedWith(FailedTransactionError)
    })
    it('redemptionCodeHash should be empty', () => {
      return gcnft0.fetch('redemptionCodeHash(uint256)', [tokenAId]).should.eventually.amorphEqual(empty)
    })
    it('redemptionCodeHashSubmittedAt should be zero', () => {
      return gcnft0.fetch('redemptionCodeHashSubmittedAt(uint256)', [tokenAId]).should.eventually.amorphEqual(zero)
    })
    testOwner(tokenAId, 3)
    testBalances([zero, zero, zero, one])
    testTotalSupply(one)
  })
  describe('account 3 should submit redemption code hash', () => {
    it('should broadcast', () => {
      return gcnft0.broadcast('submitRedemptionCodeHash(uint256,bytes32)', [tokenAId, redemptionCodeHash], {
        from: accounts[3]
      }).getConfirmation()
    })
    it('redemptionCodeHash should be correct', () => {
      return gcnft0.fetch('redemptionCodeHash(uint256)', [tokenAId]).should.eventually.amorphEqual(redemptionCodeHash)
    })
    it('redemptionCodeHashSubmittedAt should be zero', () => {
      return gcnft0.fetch('redemptionCodeHashSubmittedAt(uint256)', [tokenAId]).then((redemptionCodeHashSubmittedAt) => {
        return ultralightbeam.getLatestBlock().then((block) => {
          block.timestamp.should.amorphEqual(redemptionCodeHashSubmittedAt)
        })
      })
    })
    testOwner(tokenAId, null)
    testBalances([zero, zero, zero, zero])
    testTotalSupply(zero)
  })
})
