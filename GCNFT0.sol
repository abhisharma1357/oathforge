pragma solidity ^0.4.24;

import "ERC721.sol";
import "ERC721Metadata.sol";
import "./math/SafeMath.sol";

contract GCNFT0 is ERC721, ERC721Metadata {

  mapping(uint256 => address) public admin;
  mapping(uint256 => uint256) public sunsetInitiatedAt;
  mapping(uint256 => uint256) public redemptionCodeHashSubmittedAt;
  mapping(uint256 => bytes32) public redemptionCodeHash;

  constructor(string _name, string _symbol) ERC721Metadata(_name, _symbol) public {}

  using SafeMath for uint256;

  uint256 public totalSupply;

  function mint(uint256 _tokenId, address _to) public {
    admin[_tokenId] = msg.sender;
    _mint(_to, _tokenId);
    totalSupply = totalSupply.add(1);
  }

  function initiateSunset(uint256 _tokenId) public {
    require(admin[_tokenId] == msg.sender);
    require(sunsetInitiatedAt[_tokenId] == 0);
    sunsetInitiatedAt[_tokenId] = now;
  }

  function submitRedemptionCodeHash(uint256 _tokenId, bytes32 _redemptionCodeHash) public {
    _burn(msg.sender, _tokenId);
    redemptionCodeHashSubmittedAt[_tokenId] = now;
    redemptionCodeHash[_tokenId] = _redemptionCodeHash;
    totalSupply = totalSupply.sub(1);
  }
}
