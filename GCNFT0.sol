pragma solidity ^0.4.24;

import "ERC721.sol";
import "ERC721Metadata.sol";
import "math/SafeMath.sol";
import "ownership/Ownable.sol";

contract GCNFT0 is ERC721, ERC721Metadata, Ownable {

  using SafeMath for uint256;

  uint256 public totalSupply;
  uint256 public nextTokenId;
  mapping(uint256 => uint256) public sunsetInitiatedAt;
  mapping(uint256 => uint256) public sunsetLength;
  mapping(uint256 => uint256) public redemptionCodeHashSubmittedAt;
  mapping(uint256 => bytes32) public redemptionCodeHash;

  constructor(string _name, string _symbol) ERC721Metadata(_name, _symbol) public {}

  modifier notSunsetFinished(uint256 _tokenId) {
    if (sunsetInitiatedAt[_tokenId] > 0) {
      require(now <= sunsetInitiatedAt[_tokenId].add(sunsetLength[_tokenId]));
    }
    _;
  }

  function mint(address _to, string _tokenURI, uint256 _sunsetLength) public onlyOwner {
    sunsetLength[nextTokenId] = _sunsetLength;
    _mint(_to, nextTokenId);
    _setTokenURI(nextTokenId, _tokenURI);
    nextTokenId = nextTokenId.add(1);
    totalSupply = totalSupply.add(1);
  }

  function initiateSunset(uint256 _tokenId) public onlyOwner {
    require(sunsetInitiatedAt[_tokenId] == 0);
    sunsetInitiatedAt[_tokenId] = now;
  }

  function submitRedemptionCodeHash(uint256 _tokenId, bytes32 _redemptionCodeHash) public {
    _burn(msg.sender, _tokenId);
    redemptionCodeHashSubmittedAt[_tokenId] = now;
    redemptionCodeHash[_tokenId] = _redemptionCodeHash;
    totalSupply = totalSupply.sub(1);
  }

  function transferFrom(address _from, address _to, uint256 _tokenId) public notSunsetFinished(_tokenId) {
    super.transferFrom(_from, _to, _tokenId);
  }

  function setTokenURI(uint256 _tokenId, string _tokenURI) public onlyOwner {
    _setTokenURI(_tokenId, _tokenURI);
  }

}
