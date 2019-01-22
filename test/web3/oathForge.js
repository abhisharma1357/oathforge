const _ = require('lodash')
const Account = require('ultralightbeam/lib/Account')
const amorphHex = require('amorph-hex')
const Web3 = require('web3')
const ganache = require('ganache-cli')
const output = require('../../output')
const Artifactor = require('truffle-artifactor')
const Resolver = require('truffle-resolver')
const assert = require('assert')

const artifactsDirectory = `${__dirname}/artifacts`

const artifactor = new Artifactor(artifactsDirectory)
const resolver = new Resolver({
  'working_directory': artifactsDirectory,
  'contracts_build_directory': artifactsDirectory
})
const accounts = [Account.generate(), Account.generate(), Account.generate(), Account.generate(), Account.generate()]
const addresses = accounts.map((account) => {
  return account.address.to(amorphHex.prefixed)
})

const provider = ganache.provider({
  gasPrice: 20000000000,
  gasLimit: 8000000,
  blocktime: 2,
  accounts: accounts.map((account) => {
    return {
      secretKey: account.privateKey.to(amorphHex.prefixed),
      balance: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
    }
  })
})

async function testRevert(func) {
  let error
  try {
    await func();
  } catch(_error) {
    error = _error
  }
  assert.equal(error.message, revertMessage)
}

const revertMessage = 'VM Exception while processing transaction: revert'

const web3 = new Web3(provider)

describe('OathForge Contract', async (accounts) => {

  let OathForge
  let oathforge

  before(() => {
    return artifactor.save({
      contractName: 'OathForge',
      abi: JSON.parse(output.contracts['OathForge.sol:OathForge'].interface),
      unlinked_binary: `0x${output.contracts['OathForge.sol:OathForge'].bytecode}`
    }).then(() => {
      OathForge = resolver.require('OathForge')
      OathForge.setProvider(provider)
    })
  })

  it('Should correctly initialize constructor values of oathForge Contract', async () => {

    oathforge = await OathForge.new('OathForge', 'OathForge', { from: addresses[0] })
    let owner = await oathforge.owner.call();
    assert.equal(owner.toLowerCase(), addresses[0]);

  });

  it('Should Not be able to mint token for addresses[1] by Non Owner Account', async () => {
    testRevert(async () => {
      await oathforge.mint(addresses[1],'Body',200,{from : addresses[1]});
    })
  });

  it('Should be able to mint token for addresses[1]', async () => {

    let mint = await oathforge.mint(addresses[1],'Body',200,{from : addresses[0]});
    let totalSupply = await oathforge.totalSupply();
    let sunsetLength = await oathforge.sunsetLength(0);
    assert.equal(totalSupply.toNumber(),1);
    assert.equal(sunsetLength.toNumber(),200);
  });

  it('Should not be able to set Token URI from non Owner Account', async () => {
    testRevert(async () => {
      await oathforge.setTokenURI(0,'Oath Token Forge',{from: addresses[1]});
    })
  });

  it('Should not be able to set Token URI of non minted Token id', async () => {
    testRevert(async () => {
      await oathforge.setTokenURI(10,'Oath Token Forge',{from: addresses[0]});
    })
  });

  it('Should be able to set Token URI', async () => {

    let tokenURI = await oathforge.tokenURI.call(0);
    //console.log(tokenURI.toString());
    let = await oathforge.setTokenURI(0,'Oath Token Forge',{from: addresses[0]});
    let tokenURI1 = await oathforge.tokenURI.call(0);
    //console.log(tokenURI1.toString());
  });

  it('Should be able to mint token for addresses[3]', async () => {
      await oathforge.mint(addresses[3],'Body',300,{from : addresses[0]});
      let totalSupply = await oathforge.totalSupply();
      let sunsetLength = await oathforge.sunsetLength(1);
      assert.equal(totalSupply.toNumber(),2);
      assert.equal(sunsetLength.toNumber(),300);
  });

  it('Should be able to approve addresses[2] to spend tokens on the behalf of addresses[1] ', async () => {
      let balance = await oathforge.balanceOf(addresses[1]);
      assert.equal(balance.toNumber(),1);
      let tokenId = await oathforge.ownerOf.call(0);
      let approve = await oathforge.approve(addresses[2],0,{from : addresses[1]});
      let getApproved = await oathforge.getApproved(0);
      assert.equal(getApproved.toLowerCase(),addresses[2]);
  });

  it('Should be able to transferFrom addresses[1] to addresses[2] ', async () => {
      let balance1 = await oathforge.balanceOf(addresses[1]);
      assert.equal(balance1.toNumber(),1);
      let transferFrom = await oathforge.transferFrom(addresses[1],addresses[2],0,{from : addresses[2]});
      let balance = await oathforge.balanceOf(addresses[2]);
      assert.equal(balance.toNumber(),1);
  });

  it('Should be able to approve addresses[1] to spend tokens on the behalf of addresses[2] ', async () => {
    let balance = await oathforge.balanceOf(addresses[2]);
    assert.equal(balance.toNumber(),1);
    let tokenId = await oathforge.ownerOf.call(0);
    let approve = await oathforge.approve(addresses[1],0,{from : addresses[2]});
    let getApproved = await oathforge.getApproved(0);
    assert.equal(getApproved.toLowerCase(),addresses[1]);
  });

  it('Should be able to Safe transferFrom addresses[2] to addresses[1] ', async () => {
    let balance1 = await oathforge.balanceOf(addresses[2]);
    assert.equal(balance1.toNumber(),1);
    let transferFrom = await oathforge.transferFrom(addresses[2],addresses[1],0,{from : addresses[1]});
    let balance = await oathforge.balanceOf(addresses[1]);
    assert.equal(balance.toNumber(),1);
  });

  it('Should be able to set Approval for all tokens from addresses[1] to addresses[2] ', async () => {
    let getApproved1 = await oathforge.isApprovedForAll(addresses[1],addresses[2]);
    assert.equal(getApproved1,false);
    let balance = await oathforge.balanceOf(addresses[1]);
    assert.equal(balance.toNumber(),1);
    let approve = await oathforge.setApprovalForAll(addresses[2],true,{from : addresses[1]});
    let getApproved = await oathforge.isApprovedForAll(addresses[1],addresses[2]);
    assert.equal(getApproved,true);

  });

  it("Should Not be able to Initialsed Sunset of any Token, from non-Owner Account ", async () => {
    testRevert(async () => {
      await oathforge.initiateSunset(0,{from : addresses[1]});
    })
  });

  it("Should be able to Initialsed Sunset Only by Owner", async () => {
    let sunsetInitiatedAt = await oathforge.sunsetInitiatedAt(0);
    assert.equal(sunsetInitiatedAt.toNumber(),0);
    let sunsetInitiatedNow = await oathforge.initiateSunset(0,{from : addresses[0]});
    let sunsetInitiatedAt1 = await oathforge.sunsetInitiatedAt(0);
  });

  it("Should Not be able to Initialsed Sunset for non minted token(Failed)", async () => {
    let sunsetInitiatedAt = await oathforge.sunsetInitiatedAt(10);
    assert.equal(sunsetInitiatedAt.toNumber(),0);

    testRevert(async () => {
      await oathforge.initiateSunset(10,{from : addresses[0]})
    })
  });

  it("Should Not be able to submit Redemption Code Hash, for non minted token", async () => {
    testRevert(async () => {
      await oathforge.submitRedemptionCodeHash(7,'0xce7918a1b0485d47e6c35a974c6c0d9c5bd2b3d0f56647c0d8d0999ef88a618a', { from: addresses[8] });
    })
  });

  it("Should be able to transfer ownership of OathForge Contract ", async () => {

    let ownerOld1 = await oathforge.owner.call();
    let newowner1 = await oathforge.transferOwnership(addresses[4], { from: addresses[0] });
    let ownerNew1 = await oathforge.owner.call();
    assert.equal(ownerNew1.toLowerCase(), addresses[4], 'Transfered ownership');
  });

  it("Should be able to Reannouance ownership of OathForge Contract ", async () => {


    let newowner1 = await oathforge.renounceOwnership({from : addresses[4]});
  });

  it("Should be able to submit Redemption Code Hash ", async () => {

    let balance1 = await oathforge.balanceOf(addresses[3]);
    assert.equal(balance1.toNumber(),1);
    let newowner1 = await oathforge.submitRedemptionCodeHash(1,'0xce7918a1b0485d47e6c35a974c6c0d9c5bd2b3d0f56647c0d8d0999ef88a618a', { from: addresses[3] });

  });

  it("Should be able to get Redemption Code Hash of Token id", async () => {

    let newowner1 = await oathforge.redemptionCodeHash(1);
    assert.equal(newowner1,'0xce7918a1b0485d47e6c35a974c6c0d9c5bd2b3d0f56647c0d8d0999ef88a618a');
    //console.log(newowner1.toNumber());
  });

  it("Should be able to get timestamp Redemption Code Hash ", async () => {

    let newowner1 = await oathforge.redemptionCodeHashSubmittedAt(1);
    //console.log(newowner1.toNumber());
  });

  it("Should be able to get correct next token ID and total supply ", async () => {

    let nextTokenID = await oathforge.nextTokenId();
    let totalSupply = await oathforge.totalSupply();
    assert.equal(nextTokenID.toNumber(),3);
    assert.equal(totalSupply.toNumber(),2);

  });
})
