pragma solidity ^0.4.24;

import "ERC721.sol";
import "ERC721Metadata.sol";
import "math/SafeMath.sol";
import "ownership/Ownable.sol";

/// @title NFT Token Registry
/// @author GuildCrypt
contract GC0 is ERC721, ERC721Metadata, Ownable {

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

  /// @dev Mint a token. Only `owner` may call this function.
  /// @param _to The receiver of the token
  /// @param _tokenURI The tokenURI of the the tokenURI
  /// @param _sunsetLength The length (in seconds) that a sunset period can last
  function mint(address _to, string _tokenURI, uint256 _sunsetLength) public onlyOwner {
    sunsetLength[nextTokenId] = _sunsetLength;
    _mint(_to, nextTokenId);
    _setTokenURI(nextTokenId, _tokenURI);
    nextTokenId = nextTokenId.add(1);
    totalSupply = totalSupply.add(1);
  }

  /// @dev Initiate a sunset. Sets `sunsetInitiatedAt` to current timestamp. Only `owner` may call this function.
  /// @param _tokenId The id of the token
  function initiateSunset(uint256 _tokenId) public onlyOwner {
    require(sunsetInitiatedAt[_tokenId] == 0);
    sunsetInitiatedAt[_tokenId] = now;
  }

  /// @dev Submit a redemption code hash for a specific token. Burns the token. Sets `redemptionCodeHashSubmittedAt` to current timestamp. Decreases `totalSupply` by 1.
  /// @param _tokenId The id of the token
  /// @param _redemptionCodeHash The redemption code hash
  function submitRedemptionCodeHash(uint256 _tokenId, bytes32 _redemptionCodeHash) public {
    _burn(msg.sender, _tokenId);
    redemptionCodeHashSubmittedAt[_tokenId] = now;
    redemptionCodeHash[_tokenId] = _redemptionCodeHash;
    totalSupply = totalSupply.sub(1);
  }

  /// @dev Transfers the ownership of a given token ID to another address. Usage of this method is discouraged, use `safeTransferFrom` whenever possible. Requires the msg sender to be the owner, approved, or operator
  /// @param _from current owner of the token
  /// @param _to address to receive the ownership of the given token ID
  /// @param _tokenId uint256 ID of the token to be transferred
  function transferFrom(address _from, address _to, uint256 _tokenId) public notSunsetFinished(_tokenId) {
    super.transferFrom(_from, _to, _tokenId);
  }

  /// @dev Set `tokenUri`. Only `owner` may do this.
  /// @param _tokenId The id of the token
  /// @param _tokenURI The token URI
  function setTokenURI(uint256 _tokenId, string _tokenURI) public onlyOwner {
    _setTokenURI(_tokenId, _tokenURI);
  }

}
