pragma solidity ^0.4.24;

import "ERC721.sol";
import "ERC721Metadata.sol";
import "math/SafeMath.sol";
import "ownership/Ownable.sol";

contract GCNFT0 is ERC721, ERC721Metadata, Ownable {

  using SafeMath for uint256;

  uint256 public totalSupply;
  mapping(uint256 => address) public tokenizer;
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

  function mint(address _to, uint256 _tokenId, string _tokenURI, uint256 _sunsetLength) public onlyOwner {
    tokenizer[_tokenId] = msg.sender;
    sunsetLength[_tokenId] = _sunsetLength;
    _mint(_to, _tokenId);
    _setTokenURI(_tokenId, _tokenURI);
    totalSupply = totalSupply.add(1);
  }

  function initiateSunset(uint256 _tokenId) public {
    require(tokenizer[_tokenId] == msg.sender);
    require(sunsetInitiatedAt[_tokenId] == 0);
    sunsetInitiatedAt[_tokenId] = now;
  }

  function submitRedemptionCodeHash(bytes32 _redemptionCodeHash, uint256 _tokenId) public {
    _burn(msg.sender, _tokenId);
    redemptionCodeHashSubmittedAt[_tokenId] = now;
    redemptionCodeHash[_tokenId] = _redemptionCodeHash;
    totalSupply = totalSupply.sub(1);
  }

  function transferFrom(address _from, address _to, uint256 _tokenId) public notSunsetFinished(_tokenId) {
    super.transferFrom(_from, _to, _tokenId);
  }

}
