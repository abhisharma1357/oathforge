const ultralightbeam = require('./ultralightbeam')
const oathForgeInfo = require('../../')
const Amorph = require('amorph')
const amorphNumber = require('amorph-number')
const accounts = require('./accounts')
const FailedTransactionError = require('ultralightbeam/lib/errors/FailedTransaction')
const getRandomAmorph = require('ultralightbeam/lib/getRandomAmorph')
const BluebirdStub = require('bluebird-stub')
const testBalances = require('./testBalances')
const testOwnerOf = require('./testOwnerOf')
const testNextTokenId = require('./testNextTokenId')
const testTotalSupply = require('./testTotalSupply')
const oathForgeStub = require('./oathForgeStub')
const amorphAscii = require('amorph-ascii')
const chai = require('chai')

describe('OathForge', () => {

  const name = Amorph.from(amorphAscii, 'GuildCrypt 0')
  const symbol = Amorph.from(amorphAscii, 'GC:0')

  const zero = Amorph.from(amorphNumber.unsigned, 0)
  const one = Amorph.from(amorphNumber.unsigned, 1)
  const two = Amorph.from(amorphNumber.unsigned, 2)
  const three = Amorph.from(amorphNumber.unsigned, 3)
  const empty = new Amorph((new Uint8Array(32)).fill(0))

  const tokens = {
    a: {
      id: zero,
      uri: Amorph.from(amorphAscii, 'https://uris.com/a'),
      sunsetLength: Amorph.from(amorphNumber.unsigned, 7776000), //90 days
      redemptionCodeHash: getRandomAmorph(32)
    },
    b: {
      id: one,
      uri: Amorph.from(amorphAscii, 'https://uris.com/b'),
      sunsetLength: Amorph.from(amorphNumber.unsigned, 31536000), //1 year
      redemptionCodeHash: getRandomAmorph(32)
    },
    c: {
      id: two,
      uri: Amorph.from(amorphAscii, 'https://uris.com/c'),
      sunsetLength: Amorph.from(amorphNumber.unsigned, 7776000), //1 year
      redemptionCodeHash: getRandomAmorph(32)
    },
  }

  let oathForge

  describe('deploy', () => {
    it('should deploy', () => {
      return ultralightbeam.solDeploy(oathForgeInfo.code, oathForgeInfo.abi, [name, symbol], {
        from: accounts[0]
      }).then((_oathForge) => {
        oathForge = _oathForge
        oathForgeStub.resolve(oathForge)
      })
    })
    it('should have correct code', () => {
      return ultralightbeam.eth.getCode(oathForge.address).should.eventually.amorphEqual(oathForgeInfo.runcode)
    })
    it('should have correct code', () => {
      return ultralightbeam.eth.getCode(oathForge.address).should.eventually.amorphEqual(oathForgeInfo.runcode)
    })
    it('should have correct name', () => {
      return oathForge.fetch('name()', []).should.eventually.amorphEqual(name)
    })
    it('should have correct symbol', () => {
      return oathForge.fetch('symbol()', []).should.eventually.amorphEqual(symbol)
    })
    it('should have account 0 as owner', () => {
      return oathForge.fetch('owner()', []).should.eventually.amorphEqual(accounts[0].address)
    })
    testOwnerOf(tokens.a.id, null)
    testBalances([zero, zero, zero, zero])
    testNextTokenId(zero)
    testTotalSupply(zero)
  })
  describe('account 0 should mint tokenA to account 1', () => {
    it('should broadcast', () => {
      return oathForge.broadcast('mint(address,string,uint256)', [accounts[1].address, tokens.a.uri, tokens.a.sunsetLength], {
        from: accounts[0]
      }).getConfirmation()
    })
    it('should have correct tokenUri', () => {
      return oathForge.fetch('tokenURI(uint256)', [tokens.a.id]).should.eventually.amorphEqual(tokens.a.uri)
    })
    it('should have correct sunsetLength', () => {
      return oathForge.fetch('sunsetLength(uint256)', [tokens.a.id]).should.eventually.amorphEqual(tokens.a.sunsetLength)
    })
    testOwnerOf(tokens.a.id, 1)
    testBalances([zero, one, zero, zero])
    testNextTokenId(one)
    testTotalSupply(one)
  })
  describe('account 1 should NOT BE ABLE TO mint tokenB to account 1', () => {
    it('should broadcast', () => {
      return oathForge.broadcast('mint(address,string,uint256)', [accounts[1].address, tokens.a.uri, tokens.a.sunsetLength], {
        from: accounts[1]
      }).getConfirmation().should.be.rejectedWith(FailedTransactionError)
    })
    testOwnerOf(tokens.a.id, 1)
    testOwnerOf(tokens.b.id, null)
    testBalances([zero, one, zero, zero])
    testNextTokenId(one)
    testTotalSupply(one)
  })
  describe('account 0 should mint tokenB to account 1', () => {
    it('should broadcast', () => {
      return oathForge.broadcast('mint(address,string,uint256)', [accounts[1].address, tokens.b.uri, tokens.b.sunsetLength], {
        from: accounts[0]
      }).getConfirmation()
    })
    it('should have correct tokenUri', () => {
      return oathForge.fetch('tokenURI(uint256)', [tokens.b.id]).should.eventually.amorphEqual(tokens.b.uri)
    })
    it('should have correct sunsetLength', () => {
      return oathForge.fetch('sunsetLength(uint256)', [tokens.b.id]).should.eventually.amorphEqual(tokens.b.sunsetLength)
    })
    testOwnerOf(tokens.a.id, 1)
    testOwnerOf(tokens.b.id, 1)
    testBalances([zero, two, zero, zero])
    testNextTokenId(two)
    testTotalSupply(two)
  })
  describe('account 0 should NOT BE ABLE TO transfer tokenA from account 0 to account 2', () => {
    it('should REJECT broadcast', () => {
      return oathForge.broadcast('transferFrom(address,address,uint256)', [accounts[0].address, accounts[2].address, tokens.a.id], {
        from: accounts[0]
      }).getConfirmation().should.be.rejectedWith(FailedTransactionError)
    })
    testOwnerOf(tokens.a.id, 1)
    testOwnerOf(tokens.b.id, 1)
    testBalances([zero, two, zero, zero])
    testNextTokenId(two)
    testTotalSupply(two)
  })
  describe('account 0 should NOT BE ABLE TO transfer tokenA from account 1 to account 2', () => {
    it('should REJECT broadcast', () => {
      return oathForge.broadcast('transferFrom(address,address,uint256)', [accounts[1].address, accounts[2].address, tokens.a.id], {
        from: accounts[0]
      }).getConfirmation().should.be.rejectedWith(FailedTransactionError)
    })
    testOwnerOf(tokens.a.id, 1)
    testOwnerOf(tokens.b.id, 1)
    testBalances([zero, two, zero, zero])
    testNextTokenId(two)
    testTotalSupply(two)
  })
  describe('account 1 should transfer tokenA from account 1 to account 2', () => {
    it('should broadcast', () => {
      return oathForge.broadcast('transferFrom(address,address,uint256)', [accounts[1].address, accounts[2].address, tokens.a.id], {
        from: accounts[1]
      }).getConfirmation()
    })
    testOwnerOf(tokens.a.id, 2)
    testOwnerOf(tokens.b.id, 1)
    testBalances([zero, one, one, zero])
    testNextTokenId(two)
    testTotalSupply(two)
  })
  describe('account 2 should NOT BE ABLE TO sunset tokenA', () => {
    it('should REJECT broadcast', () => {
      return oathForge.broadcast('initiateSunset(uint256)', [tokens.a.id], {
        from: accounts[2]
      }).getConfirmation().should.be.rejectedWith(FailedTransactionError)
    })
    it('sunset initiated at should be 0', () => {
      return oathForge.fetch('sunsetInitiatedAt(uint256)', [tokens.a.id]).should.eventually.amorphEqual(zero)
    })
    testOwnerOf(tokens.a.id, 2)
    testOwnerOf(tokens.b.id, 1)
    testBalances([zero, one, one, zero])
    testNextTokenId(two)
    testTotalSupply(two)
  })
  describe('account 0 should sunset tokenA', () => {
    it('should broadcast', () => {
      return oathForge.broadcast('initiateSunset(uint256)', [tokens.a.id], {
        from: accounts[0]
      }).getConfirmation()
    })
    it('sunset initiated at should be latest block timestamp', () => {
      return oathForge.fetch('sunsetInitiatedAt(uint256)', [tokens.a.id]).then((sunsetInitiatedAt) => {
        return ultralightbeam.getLatestBlock().then((block) => {
          block.timestamp.should.amorphEqual(sunsetInitiatedAt)
        })
      })
    })
    testOwnerOf(tokens.a.id, 2)
    testOwnerOf(tokens.b.id, 1)
    testBalances([zero, one, one, zero])
    testNextTokenId(two)
    testTotalSupply(two)
  })
  describe('account 2 should safeTransferFrom tokenA from account 2 to account 3', () => {
    it('should broadcast', () => {
      return oathForge.broadcast('safeTransferFrom(address,address,uint256)', [accounts[2].address, accounts[3].address, tokens.a.id], {
        from: accounts[2]
      }).getConfirmation()
    })
    testOwnerOf(tokens.a.id, 3)
    testOwnerOf(tokens.b.id, 1)
    testBalances([zero, one, zero, one])
    testNextTokenId(two)
    testTotalSupply(two)
  })
  describe('account 0 should NOT BE ABLE TO submit redemption code hash', () => {
    it('should REJECT broadcast', () => {
      return oathForge.broadcast('submitRedemptionCodeHash(uint256,bytes32)', [tokens.a.id, tokens.a.redemptionCodeHash], {
        from: accounts[0]
      }).getConfirmation().should.be.rejectedWith(FailedTransactionError)
    })
    it('redemptionCodeHash should be empty', () => {
      return oathForge.fetch('redemptionCodeHash(uint256)', [tokens.a.id]).should.eventually.amorphEqual(empty)
    })
    it('redemptionCodeHashSubmittedAt should be zero', () => {
      return oathForge.fetch('redemptionCodeHashSubmittedAt(uint256)', [tokens.a.id]).should.eventually.amorphEqual(zero)
    })
    testOwnerOf(tokens.a.id, 3)
    testOwnerOf(tokens.b.id, 1)
    testBalances([zero, one, zero, one])
    testNextTokenId(two)
    testTotalSupply(two)
  })
  describe('account 3 should submit redemption code hash', () => {
    it('should broadcast', () => {
      return oathForge.broadcast('submitRedemptionCodeHash(uint256,bytes32)', [tokens.a.id, tokens.a.redemptionCodeHash], {
        from: accounts[3]
      }).getConfirmation()
    })
    it('redemptionCodeHash should be correct', () => {
      return oathForge.fetch('redemptionCodeHash(uint256)', [tokens.a.id]).should.eventually.amorphEqual(tokens.a.redemptionCodeHash)
    })
    it('redemptionCodeHashSubmittedAt should be zero', () => {
      return oathForge.fetch('redemptionCodeHashSubmittedAt(uint256)', [tokens.a.id]).then((redemptionCodeHashSubmittedAt) => {
        return ultralightbeam.getLatestBlock().then((block) => {
          block.timestamp.should.amorphEqual(redemptionCodeHashSubmittedAt)
        })
      })
    })
    testOwnerOf(tokens.a.id, null)
    testOwnerOf(tokens.b.id, 1)
    testBalances([zero, one, zero, zero])
    testNextTokenId(two)
    testTotalSupply(one)
  })
  describe('account 0 should sunset tokenB', () => {
    it('should broadcast', () => {
      return oathForge.broadcast('initiateSunset(uint256)', [tokens.b.id], {
        from: accounts[0]
      }).getConfirmation()
    })
    it('sunset initiated at should be latest block timestamp', () => {
      return oathForge.fetch('sunsetInitiatedAt(uint256)', [tokens.b.id]).then((sunsetInitiatedAt) => {
        return ultralightbeam.getLatestBlock().then((block) => {
          block.timestamp.should.amorphEqual(sunsetInitiatedAt)
        })
      })
    })
    testOwnerOf(tokens.a.id, null)
    testOwnerOf(tokens.b.id, 1)
    testBalances([zero, one, zero, zero])
    testNextTokenId(two)
    testTotalSupply(one)
  })
  describe('account 1 should transfer tokenB from account 1 to account 2', () => {
    it('should broadcast', () => {
      return oathForge.broadcast('transferFrom(address,address,uint256)', [accounts[1].address, accounts[2].address, tokens.b.id], {
        from: accounts[1]
      }).getConfirmation()
    })
    testOwnerOf(tokens.a.id, null)
    testOwnerOf(tokens.b.id, 2)
    testBalances([zero, zero, one, zero])
    testNextTokenId(two)
    testTotalSupply(one)
  })
  describe('skip time', () => {
    let prevBlock
    let currBlock
    before(() => {
      return ultralightbeam.getLatestBlock().then((block) => {
        prevBlock = block
      })
    })
    it('should skip tokenB.sunsetLength', (done) => {
      ultralightbeam.provider.send({
        jsonrpc: '2.0',
        method: 'evm_increaseTime',
        params: [tokens.b.sunsetLength.to(amorphNumber.unsigned)],
        id: new Date().getSeconds()
      }, (err, results) => {
        done(err)
      })
    })
    it('should mine a block', () => {
      ultralightbeam.provider.send({
        jsonrpc: '2.0',
        method: 'evm_mine',
        params: [],
        id: (new Date()).getTime()
      }, () => {})

      return ultralightbeam.blockPoller.blockPromise
    })
    it('should get latest block', () => {
      return ultralightbeam.getLatestBlock().then((block) => {
        currBlock = block
      })
    })
    it('currBlock.number should be prevBlock.number + 1', () => {
      prevBlock.number.as(amorphNumber.unsigned, (number) => {
        return number + 1
      }).should.amorphEqual(currBlock.number)
    })
    it('currBlock.timestamp should be (roughly) prevBlock.timestamp + tokenB.sunsetLength', () => {
      const prevBlockTimestamp = prevBlock.timestamp.to(amorphNumber.unsigned)
      const currBlockTimestamp = currBlock.timestamp.to(amorphNumber.unsigned)
      const tokenBSunsetLength = tokens.b.sunsetLength.to(amorphNumber.unsigned)
      chai.expect(Math.abs(prevBlockTimestamp + tokenBSunsetLength - currBlockTimestamp)).to.be.lte(5)
    })
  })
  describe('account 2 should NOT BE ABLE TO transfer tokenB from account 2 to account 3', () => {
    it('should broadcast', () => {
      return oathForge.broadcast('transferFrom(address,address,uint256)', [accounts[2].address, accounts[3].address, tokens.b.id], {
        from: accounts[2]
      }).getConfirmation().should.be.rejectedWith(FailedTransactionError)
    })
    testOwnerOf(tokens.a.id, null)
    testOwnerOf(tokens.b.id, 2)
    testBalances([zero, zero, one, zero])
    testNextTokenId(two)
    testTotalSupply(one)
  })
  describe('account 2 should NOT BE ABLE TO safeTransferFrom tokenB from account 2 to account 3', () => {
    it('should broadcast', () => {
      return oathForge.broadcast('safeTransferFrom(address,address,uint256)', [accounts[2].address, accounts[3].address, tokens.b.id], {
        from: accounts[2]
      }).getConfirmation().should.be.rejectedWith(FailedTransactionError)
    })
    testOwnerOf(tokens.a.id, null)
    testOwnerOf(tokens.b.id, 2)
    testBalances([zero, zero, one, zero])
    testNextTokenId(two)
    testTotalSupply(one)
  })
  describe('account 2 should submit redemption code hash', () => {
    it('should broadcast', () => {
      return oathForge.broadcast('submitRedemptionCodeHash(uint256,bytes32)', [tokens.b.id, tokens.b.redemptionCodeHash], {
        from: accounts[2]
      }).getConfirmation()
    })
    it('redemptionCodeHash should be correct', () => {
      return oathForge.fetch('redemptionCodeHash(uint256)', [tokens.b.id]).should.eventually.amorphEqual(tokens.b.redemptionCodeHash)
    })
    it('redemptionCodeHashSubmittedAt should be zero', () => {
      return oathForge.fetch('redemptionCodeHashSubmittedAt(uint256)', [tokens.b.id]).then((redemptionCodeHashSubmittedAt) => {
        return ultralightbeam.getLatestBlock().then((block) => {
          block.timestamp.should.amorphEqual(redemptionCodeHashSubmittedAt)
        })
      })
    })
    testOwnerOf(tokens.a.id, null)
    testOwnerOf(tokens.b.id, null)
    testBalances([zero, zero, zero, zero])
    testNextTokenId(two)
    testTotalSupply(zero)
  })
  describe('account 2 should NOT be able to re-submit redemption code hash', () => {
    it('should broadcast', () => {
      return oathForge.broadcast('submitRedemptionCodeHash(uint256,bytes32)', [tokens.b.id, getRandomAmorph(32)], {
        from: accounts[2]
      }).getConfirmation().should.be.rejectedWith(FailedTransactionError)
    })
    it('redemptionCodeHash should be correct', () => {
      return oathForge.fetch('redemptionCodeHash(uint256)', [tokens.b.id]).should.eventually.amorphEqual(tokens.b.redemptionCodeHash)
    })
    it('redemptionCodeHashSubmittedAt should be zero', () => {
      return oathForge.fetch('redemptionCodeHashSubmittedAt(uint256)', [tokens.b.id]).then((redemptionCodeHashSubmittedAt) => {
        return ultralightbeam.getLatestBlock().then((block) => {
          block.timestamp.should.amorphEqual(redemptionCodeHashSubmittedAt)
        })
      })
    })
    testOwnerOf(tokens.a.id, null)
    testOwnerOf(tokens.b.id, null)
    testBalances([zero, zero, zero, zero])
    testNextTokenId(two)
    testTotalSupply(zero)
  })
  describe('account 0 should mint tokenC to account 1', () => {
    it('should broadcast', () => {
      return oathForge.broadcast('mint(address,string,uint256)', [accounts[1].address, tokens.c.uri, tokens.c.sunsetLength], {
        from: accounts[0]
      }).getConfirmation()
    })
    it('should have correct tokenUri', () => {
      return oathForge.fetch('tokenURI(uint256)', [tokens.c.id]).should.eventually.amorphEqual(tokens.c.uri)
    })
    it('should have correct sunsetLength', () => {
      return oathForge.fetch('sunsetLength(uint256)', [tokens.c.id]).should.eventually.amorphEqual(tokens.c.sunsetLength)
    })
    testOwnerOf(tokens.c.id, 1)
    testBalances([zero, one, zero, zero])
    testNextTokenId(three)
    testTotalSupply(one)
  })
  describe('account 0 should setTokenURI of token c', () => {
    it('should broadcast', () => {
      return oathForge.broadcast('setTokenURI(uint256,string)', [tokens.c.id, tokens.a.uri], {
        from: accounts[0]
      }).getConfirmation()
    })
    it('should have correct tokenUri', () => {
      return oathForge.fetch('tokenURI(uint256)', [tokens.c.id]).should.eventually.amorphEqual(tokens.a.uri)
    })
    testOwnerOf(tokens.c.id, 1)
    testBalances([zero, one, zero, zero])
    testNextTokenId(three)
    testTotalSupply(one)
  })
  describe('account 1 should NOT be able to setTokenURI of token c', () => {
    it('should broadcast', () => {
      return oathForge.broadcast('setTokenURI(uint256,string)', [tokens.c.id, tokens.a.uri], {
        from: accounts[1]
      }).getConfirmation().should.be.rejectedWith(FailedTransactionError)
    })
    it('should have correct tokenUri', () => {
      return oathForge.fetch('tokenURI(uint256)', [tokens.c.id]).should.eventually.amorphEqual(tokens.a.uri)
    })
    testOwnerOf(tokens.c.id, 1)
    testBalances([zero, one, zero, zero])
    testNextTokenId(three)
    testTotalSupply(one)
  })
  describe('account 0 should be able to change token uri back', () => {
    it('should broadcast', () => {
      return oathForge.broadcast('setTokenURI(uint256,string)', [tokens.c.id, tokens.c.uri], {
        from: accounts[0]
      }).getConfirmation()
    })
    it('should have correct tokenUri', () => {
      return oathForge.fetch('tokenURI(uint256)', [tokens.c.id]).should.eventually.amorphEqual(tokens.c.uri)
    })
    testOwnerOf(tokens.c.id, 1)
    testBalances([zero, one, zero, zero])
    testNextTokenId(three)
    testTotalSupply(one)
  })
})
