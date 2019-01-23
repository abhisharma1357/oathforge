const OathForge = artifacts.require('OathForge.sol');
const RiftPact = artifacts.require('RiftPact.sol');
const DaiToken = artifacts.require('DAITOKEN.sol');
var Web3 = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

contract('OathForge Contract', async (accounts) => {
  
  it('Should correctly initialize constructor values of oathForge Contract', async () => {

    this.tokenhold = await OathForge.new(OathForge,OathForge, { gas: 60000000 });
    let owner = await this.tokenhold.owner.call();
    assert.equal(owner, accounts[0]);

  });
  
  it('Should Not be able to mint token for accounts[1] by Non Owner Account', async () => {

  try{ await this.tokenhold.mint(accounts[1],'Body',200,{from : accounts[1]});
  }catch(error){
    var error_ = 'VM Exception while processing transaction: revert';
    assert.equal(error.message, error_, 'Reverted ');

  }
  });

  it('Should be able to mint token for accounts[1]', async () => {

    await this.tokenhold.mint(accounts[1],'Body',200,{from : accounts[0]});
    let totalSupply = await this.tokenhold.totalSupply();
    let sunsetLength = await this.tokenhold.sunsetLength(0);
    assert.equal(totalSupply.toNumber(),1);
    assert.equal(sunsetLength.toNumber(),200);
});

it('Should not be able to set Token URI from non Owner Account', async () => {
try{
  await this.tokenhold.setTokenURI(0,'Oath Token Forge',{from: accounts[1]});
}catch(error){
  var error_ = 'VM Exception while processing transaction: revert';
  assert.equal(error.message, error_, 'Reverted ');
}

});

it('Should not be able to set Token URI of non minted Token id', async () => {
  try{
    await this.tokenhold.setTokenURI(10,'Oath Token Forge',{from: accounts[1]});
  }catch(error){
    var error_ = 'VM Exception while processing transaction: revert';
    assert.equal(error.message, error_, 'Reverted ');
  }
  
  });

it('Should be able to set Token URI', async () => {

  let tokenURI = await this.tokenhold.tokenURI.call(0);
  assert.equal(tokenURI.toString(),'Body');
  await this.tokenhold.setTokenURI(0,'Oath Token Forge',{from: accounts[0]});
  let tokenURI1 = await this.tokenhold.tokenURI.call(0);
  assert.equal(tokenURI1.toString(),'Oath Token Forge'); 
});

it('Should be able to mint token for accounts[3]', async () => {

    await this.tokenhold.mint(accounts[3],'Body',200,{from : accounts[0]});
    let totalSupply = await this.tokenhold.totalSupply();
    let sunsetLength = await this.tokenhold.sunsetLength(0);
    assert.equal(totalSupply.toNumber(),2);
    assert.equal(sunsetLength.toNumber(),200);
});

it('Should Not be able to approve accounts[2] to spend tokens on the behalf of accounts[1] of negative token ID ', async () => {

try{  await this.tokenhold.approve(accounts[2],-1,{from : accounts[1]});
}catch(error){
  var error_ = 'VM Exception while processing transaction: revert';
  assert.equal(error.message, error_, 'Reverted ');  
}
});

it('Should be able to approve accounts[2] to spend tokens on the behalf of accounts[1] ', async () => {

    let balance = await this.tokenhold.balanceOf(accounts[1]);
    assert.equal(balance.toNumber(),1);
    await this.tokenhold.approve(accounts[2],0,{from : accounts[1]});
    let getApproved = await this.tokenhold.getApproved(0);
    assert.equal(getApproved,accounts[2]);

});

it('Should be able to transferFrom accounts[1] to accounts[2] ', async () => {

    let balance1 = await this.tokenhold.balanceOf(accounts[1]);
    assert.equal(balance1.toNumber(),1);
    await this.tokenhold.transferFrom(accounts[1],accounts[2],0,{from : accounts[2]});
    let balance = await this.tokenhold.balanceOf(accounts[2]);
    assert.equal(balance.toNumber(),1);
 
});

it('Should be able to approve accounts[1] to spend tokens on the behalf of accounts[2] ', async () => {

  let balance = await this.tokenhold.balanceOf(accounts[2]);
  assert.equal(balance.toNumber(),1);
  await this.tokenhold.approve(accounts[1],0,{from : accounts[2]});
  let getApproved = await this.tokenhold.getApproved(0);
  assert.equal(getApproved,accounts[1]);

});

it('Should be able to Safe transferFrom accounts[2] to accounts[1] ', async () => {

  let balance1 = await this.tokenhold.balanceOf(accounts[2]);
  assert.equal(balance1.toNumber(),1);
  await this.tokenhold.transferFrom(accounts[2],accounts[1],0,{from : accounts[1]});
  let balance = await this.tokenhold.balanceOf(accounts[1]);
  assert.equal(balance.toNumber(),1);

});

it('Should be able to set Approval for all tokens from accounts[1] to accounts[2] ', async () => {

  let getApproved1 = await this.tokenhold.isApprovedForAll(accounts[1],accounts[2]);
  assert.equal(getApproved1,false);
  let balance = await this.tokenhold.balanceOf(accounts[1]);
  assert.equal(balance.toNumber(),1);
  await this.tokenhold.setApprovalForAll(accounts[2],true,{from : accounts[1]});
  let getApproved = await this.tokenhold.isApprovedForAll(accounts[1],accounts[2]);
  assert.equal(getApproved,true);

});

it("Should Not be able to Initialsed Sunset of any Token, from non-Owner Account ", async () => {
try{
  await this.tokenhold.initiateSunset(0,{from : accounts[1]});
}catch(error){
  var error_ = 'VM Exception while processing transaction: revert';
  assert.equal(error.message, error_, 'Reverted ');  
}
});

it("Should be able to Initialsed Sunset Only by Owner", async () => {

  let sunsetInitiatedAt = await this.tokenhold.sunsetInitiatedAt(0);
  assert.equal(sunsetInitiatedAt.toNumber(),0);
  await this.tokenhold.initiateSunset(0,{from : accounts[0]});
});

it("Should Not be able to Initialsed Sunset for non minted token(Failed)", async () => {

  let sunsetInitiatedAt = await this.tokenhold.sunsetInitiatedAt(10);
  assert.equal(sunsetInitiatedAt.toNumber(),0);
  await this.tokenhold.initiateSunset(10,{from : accounts[0]});
 // This should be failed as explained in report under issue and as a suggestions also
  
});

it('Should Not be able to mint token for with negative Sunset length(fail)', async () => {

  await this.tokenhold.mint(accounts[8],'Body',-200,{from : accounts[0]});
});

it("Should Not be able to submit Redemption Code Hash, for non minted token", async () => {

  try{await this.tokenhold.submitRedemptionCodeHash(7,0xce7918a1b0485d47e6c35a974c6c0d9c5bd2b3d0f56647c0d8d0999ef88a618a, { from: accounts[8] });
  }catch(error){
    var error_ = 'VM Exception while processing transaction: revert';
  assert.equal(error.message, error_, 'Reverted ');  

  }
});

it("Should be able to transfer ownership of OathForge Contract ", async () => {

    let ownerOld1 = await this.tokenhold.owner.call();
    assert.equal(ownerOld1, accounts[0], 'Transfered ownership');
    await this.tokenhold.transferOwnership(accounts[4], { from: accounts[0] });
    let ownerNew1 = await this.tokenhold.owner.call();
    assert.equal(ownerNew1, accounts[4], 'Transfered ownership');
  });

  it("Should be able to Reannouance ownership of OathForge Contract ", async () => {

    let ownerOld1 = await this.tokenhold.owner.call();
    assert.equal(ownerOld1, accounts[4], 'Transfered ownership');
    await this.tokenhold.renounceOwnership({from : accounts[4]});
    let newowner1 = await this.tokenhold.owner.call();
    let address1 = 0x0000000000000000000000000000000000000000;
    assert.equal(newowner1,address1, 'Transfered ownership');
  });

  it("Should be able to submit Redemption Code Hash ", async () => {

    let balance1 = await this.tokenhold.balanceOf(accounts[3]);
    assert.equal(balance1.toNumber(),1);
    await this.tokenhold.submitRedemptionCodeHash(1,0xce7918a1b0485d47e6c35a974c6c0d9c5bd2b3d0f56647c0d8d0999ef88a618a, { from: accounts[3] });

  });

  it("Should be able to get Redemption Code Hash of Token id", async () => {

    let codeHash = await this.tokenhold.redemptionCodeHash(1);
    assert.equal(codeHash,0xce7918a1b0485d47e6c35a974c6c0d9c5bd2b3d0f56647c0d8d0999ef88a618a);
    
  });

  it("Should be able to get timestamp Redemption Code Hash ", async () => {

    let codeSubmitteed = await this.tokenhold.redemptionCodeHashSubmittedAt(1);
    //console.log(codeSubmitteed.toNumber());
  });

  it("Should be able to get correct next token ID and total supply ", async () => {

    let nextTokenID = await this.tokenhold.nextTokenId();
    let totalSupply = await this.tokenhold.totalSupply();
    assert.equal(nextTokenID.toNumber(),3);
    assert.equal(totalSupply.toNumber(),2);
 
});

it('Should correctly initialize constructor values of Dai Token Contract', async () => {

  this.daihold = await DaiToken.new(accounts[0],{ gas: 60000000 });
  let owner = await this.daihold.owner.call();
  assert.equal(owner, accounts[0]);

});

it('Should issue Dai token to accounts[0],[1],[2],[3]', async () => {

  await this.daihold.releaseTokens(accounts[0],1);
  await this.daihold.releaseTokens(accounts[1],2);
  await this.daihold.releaseTokens(accounts[2],3);
  await this.daihold.releaseTokens(accounts[3],4);
  let balance1 = await this.daihold.balanceOf(accounts[0]);
  let balance2 = await this.daihold.balanceOf(accounts[1]);
  let balance3 = await this.daihold.balanceOf(accounts[2]);
  let balance4 = await this.daihold.balanceOf(accounts[3]);
  assert.equal(balance1.toNumber()/10**18,1);
  assert.equal(balance2.toNumber()/10**18,2);
  assert.equal(balance3.toNumber()/10**18,3);
  assert.equal(balance4.toNumber()/10**18,4);

});

it('Should Not initialize constructor values of RiftPack Contract of TokenID that is not minted from OathForge(Test Case Failed)', async () => {

  this.RiftPact = await RiftPact.new(20,100,this.daihold.address,this.tokenhold.address, { gas: 60000000 });
});

it('Should correctly initialize constructor values of RiftPack Contract', async () => {

  this.RiftPact = await RiftPact.new(0,100,this.daihold.address,this.tokenhold.address, { gas: 60000000 });
});

it('Should be able to check Correct DAI Token Address', async () => {

  let Dai = await this.RiftPact.daiAddress();
  assert.equal(Dai,this.daihold.address);

});

it('Should be able to check Correct oathForge Contract Address', async () => {

  let oathForgeAddress = await this.RiftPact.oathForgeAddress();
  assert.equal(oathForgeAddress,this.tokenhold.address);

});

it('Should be able to check Correct OathForgeToken ID', async () => {

  let tokenID = await this.RiftPact.oathForgeTokenId();
  assert.equal(tokenID.toNumber(),0);

});

it('Should be able to check Minimum BID', async () => {

  let minBid = await this.RiftPact.minBid();
  assert.equal(minBid.toNumber(),1);

});

it('Should be able to check Auction Allowed Time', async () => {

  let auctionStart = await this.RiftPact.auctionAllowedAt();
  assert.equal(auctionStart.toNumber(),100);

});

it('Should Check Aucton completed or not', async () => {

  let auctionStatus = await this.RiftPact.auctionCompletedAt();
  assert.equal(auctionStatus.toNumber(),0);
});

it('Should start Auction', async () => {

  let auctionStarted = await this.RiftPact.auctionStartedAt();
  assert.equal(auctionStarted,0);
  await this.RiftPact.startAuction();

});

it('Should check Auction Started at', async () => {

  let auctionStarted = await this.RiftPact.auctionStartedAt();
  //console.log(auctionStarted.toNumber()); 
});

it('Should Approve Auction/RiftPact contract to transfer DAI tokens on the behalf of Bidder accounts[1]', async () => {

  await this.daihold.approve(this.RiftPact.address,10**18,{from :  accounts[1]});
  let allowance = await this.daihold.allowance(accounts[1],this.RiftPact.address);
  assert.equal(allowance.toNumber()/10**18,1);
});

it('Should participate in a Auction by accounts[1]', async () => {

  let balanceAccountOneBefore = await this.daihold.balanceOf(accounts[1]);
  assert.equal(balanceAccountOneBefore.toNumber()/10**18,2);
  await this.RiftPact.submitBid(1000000000,{from : accounts[1]});
  let balanceAccountOneAfter = await this.daihold.balanceOf(accounts[1]);
  assert.equal(balanceAccountOneAfter.toNumber()/10**18,1.99999);

});

it('Should be able to get Top Bid After Auction started and participation', async () => {

  let topBid = await this.RiftPact.topBid();
  assert.equal(topBid.toNumber(),1000000000);
});

it('Should be able to get Top Bidder After Auction started and participation', async () => {

  let topBidder = await this.RiftPact.topBidder();
  assert.equal(topBidder,accounts[1]);
});

it('Should Approve Auction/RiftPact contract to transfer DAI tokens on the behalf of Bidder accounts[2] ', async () => {

  await this.daihold.approve(this.RiftPact.address,10**18,{from :  accounts[2]});
  let allowance = await this.daihold.allowance(accounts[2],this.RiftPact.address);
  assert.equal(allowance.toNumber()/10**18,1);
});

it('Should participate in a Auction by accounts[2]', async () => {

  let balanceAccountTwo = await this.daihold.balanceOf(accounts[2]);
  assert.equal(balanceAccountTwo.toNumber()/10**18,3);
  await this.RiftPact.submitBid(20000000000,{from : accounts[2]});
  let balanceAccountTwoLater = await this.daihold.balanceOf(accounts[2]);
  assert.equal(balanceAccountTwoLater.toNumber()/10**18,2.9998);
  let balanceDaiContract = await this.daihold.balanceOf(this.RiftPact.address);
  assert.equal(balanceDaiContract.toNumber()/10**18,0.0002);
  let topBid = await this.RiftPact.topBid();
  assert.equal(topBid.toNumber(),20000000000);
});

it('Should Not be able participate in a Auction by accounts[3] by submiting bid less than minimum Bid', async () => {
try{
  await this.RiftPact.submitBid(20000,{from : accounts[2]});
}catch(error){
  var error_ = 'VM Exception while processing transaction: revert';
  assert.equal(error.message, error_, 'Reverted ');    
}
});

  it(" Should be able to transfer Tokens ", async () => {

    let balancebefore = await this.RiftPact.balanceOf(accounts[6]);
    assert.equal(balancebefore.toNumber(), 0, 'balance of beneficery(reciever)');
    await this.RiftPact.transfer(accounts[6], 100, { from: accounts[0], gas: 5000000 });
    let balanceRecieverAfter = await this.RiftPact.balanceOf.call(accounts[6]);
    assert.equal(balanceRecieverAfter.toNumber(), 100, 'balance of beneficery(reciever)');    
  });

  it('Should Complete Auction', async () => {

    let auctionStatus = await this.RiftPact.auctionCompletedAt();
    assert.equal(auctionStatus.toNumber(),0);
    await this.RiftPact.completeAuction();
  });

  it('Should Payout DAI Token After auction is completed', async () => {
    let balanceRiftPActInDai = await this.daihold.balanceOf(this.RiftPact.address);
    assert.equal(balanceRiftPActInDai.toNumber()/10**18,0.0002);
    let balanceAccountOneInDai = await this.daihold.balanceOf(accounts[6]);
    assert.equal(balanceAccountOneInDai.toNumber(),0);
    await this.RiftPact.payout({from : accounts[6]});
    let balanceRiftPActInDaiLater = await this.daihold.balanceOf(this.RiftPact.address);
    assert.equal(balanceRiftPActInDaiLater.toNumber()/10**18,0.000198);
    let balanceAccountOneInDaiLater = await this.daihold.balanceOf(accounts[6]);
    assert.equal(balanceAccountOneInDaiLater.toNumber()/10**18,0.000002);
    
  });


  it('Should Payout DAI Token After auction is completed', async () => {
    let balanceRiftPActInDai = await this.daihold.balanceOf(this.RiftPact.address);
    assert.equal(balanceRiftPActInDai.toNumber(),198000000000000);
    let balanceAccountZeroInDai = await this.daihold.balanceOf(accounts[0]);
    assert.equal(balanceAccountZeroInDai.toNumber()/10**18,1);
    await this.RiftPact.payout({from : accounts[0]});
    let balanceRiftPActInDaiLater = await this.daihold.balanceOf(this.RiftPact.address);
    assert.equal(balanceRiftPActInDaiLater.toNumber(),0);
    let balanceAccountZeroInDaiLater = await this.daihold.balanceOf(accounts[0]);
    assert.equal(balanceAccountZeroInDaiLater.toNumber()/10**18,1.000198);
    

  });

  it('Should Not be able to Complete Auction When it is already Finish', async () => {
    try{
      await this.RiftPact.completeAuction({from : accounts[1]});
    }catch(error){
      var error_ = 'VM Exception while processing transaction: revert';
      assert.equal(error.message, error_, 'Reverted ');    
    }
    });

  it("should Approve address to spend specific token ", async () => {

    this.RiftPact.approve(accounts[7], 100, { from: accounts[6] });
    let allowance = await this.RiftPact.allowance.call(accounts[6], accounts[7]);
    assert.equal(allowance.toNumber(), 100, "allowance is wrong when approve");

  });

  it("should increase Approval ", async () => {

    let allowance1 = await this.RiftPact.allowance.call(accounts[6], accounts[7]);
    assert.equal(allowance1, 100, "allowance is wrong when increase approval");
    this.RiftPact.increaseAllowance(accounts[7], 100, { from: accounts[6] });
    let allowanceNew = await this.RiftPact.allowance.call(accounts[6], accounts[7]);
    assert.equal(allowanceNew, 200, "allowance is wrong when increase approval done");

  });

  it("should decrease Approval ", async () => {

    let allowance1 = await this.RiftPact.allowance.call(accounts[6], accounts[7]);
    assert.equal(allowance1, 200, "allowance is wrong when increase approval");
    this.RiftPact.decreaseAllowance(accounts[7], 100, { from: accounts[6] });
    let allowanceNew = await this.RiftPact.allowance.call(accounts[6], accounts[7]);
    assert.equal(allowanceNew, 100, "allowance is wrong when increase approval done");

  });

  it("should not increase Approval for Negative Tokens", async () => {

  try{      
    this.RiftPact.increaseAllowance(accounts[7], -100, { from: accounts[6] });

  }catch(error){
    var error_ = 'VM Exception while processing transaction: revert';
    assert.equal(error.message, error_, 'Reverted ');
  
  }
  });

})

