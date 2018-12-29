# NFT Token Registry
Author: GuildCrypt


| Name | Type |
|---|---|
| [`Approval(address,address,uint256)`](#Approval(address,address,uint256)) | event |
| [`ApprovalForAll(address,address,bool)`](#ApprovalForAll(address,address,bool)) | event |
| [`approve(address,uint256)`](#approve(address,uint256)) | function |
| [`constructor(string,string)`](#constructor(string,string)) | constructor |
| [`balanceOf(address)`](#balanceOf(address)) | function |
| [`getApproved(uint256)`](#getApproved(uint256)) | function |
| [`initiateSunset(uint256)`](#initiateSunset(uint256)) | function |
| [`isApprovedForAll(address,address)`](#isApprovedForAll(address,address)) | function |
| [`isOwner()`](#isOwner()) | function |
| [`mint(address,string,uint256)`](#mint(address,string,uint256)) | function |
| [`name()`](#name()) | function |
| [`nextTokenId()`](#nextTokenId()) | function |
| [`owner()`](#owner()) | function |
| [`ownerOf(uint256)`](#ownerOf(uint256)) | function |
| [`OwnershipTransferred(address,address)`](#OwnershipTransferred(address,address)) | event |
| [`redemptionCodeHash(uint256)`](#redemptionCodeHash(uint256)) | function |
| [`redemptionCodeHashSubmittedAt(uint256)`](#redemptionCodeHashSubmittedAt(uint256)) | function |
| [`renounceOwnership()`](#renounceOwnership()) | function |
| [`safeTransferFrom(address,address,uint256,bytes)`](#safeTransferFrom(address,address,uint256,bytes)) | function |
| [`safeTransferFrom(address,address,uint256)`](#safeTransferFrom(address,address,uint256)) | function |
| [`setApprovalForAll(address,bool)`](#setApprovalForAll(address,bool)) | function |
| [`setTokenURI(uint256,string)`](#setTokenURI(uint256,string)) | function |
| [`submitRedemptionCodeHash(uint256,bytes32)`](#submitRedemptionCodeHash(uint256,bytes32)) | function |
| [`sunsetInitiatedAt(uint256)`](#sunsetInitiatedAt(uint256)) | function |
| [`sunsetLength(uint256)`](#sunsetLength(uint256)) | function |
| [`supportsInterface(bytes4)`](#supportsInterface(bytes4)) | function |
| [`symbol()`](#symbol()) | function |
| [`tokenURI(uint256)`](#tokenURI(uint256)) | function |
| [`totalSupply()`](#totalSupply()) | function |
| [`Transfer(address,address,uint256)`](#Transfer(address,address,uint256)) | event |
| [`transferFrom(address,address,uint256)`](#transferFrom(address,address,uint256)) | function |
| [`transferOwnership(address)`](#transferOwnership(address)) | function |
#### <a name="Approval(address,address,uint256)"></a> `Approval(address,address,uint256)`
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `address` | `owner` |  |
| `1` | `address` | `approved` |  |
| `2` | `uint256` | `tokenId` |  |
---
#### <a name="ApprovalForAll(address,address,bool)"></a> `ApprovalForAll(address,address,bool)`
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `address` | `owner` |  |
| `1` | `address` | `operator` |  |
| `2` | `bool` | `approved` |  |
---
#### <a name="approve(address,uint256)"></a> `approve(address,uint256)`
Approves another address to transfer the given token ID The zero address indicates there is no approved address. There can only be one approved address per token at a given time. Can only be called by the token owner or an approved operator.
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `address` | `to` | address to be approved for the given token ID |
| `1` | `uint256` | `tokenId` | uint256 ID of the token to be approved |
---
#### <a name="constructor(string,string)"></a> `constructor(string,string)`
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `string` | `_name` |  |
| `1` | `string` | `_symbol` |  |
---
#### <a name="balanceOf(address)"></a> `balanceOf(address)`
Gets the balance of the specified address
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `address` | `owner` | address to query the balance of |
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `uint256` |  |  |
---
#### <a name="getApproved(uint256)"></a> `getApproved(uint256)`
Gets the approved address for a token ID, or zero if no address set Reverts if the token ID does not exist.
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `uint256` | `tokenId` | uint256 ID of the token to query the approval of |
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `address` |  |  |
---
#### <a name="initiateSunset(uint256)"></a> `initiateSunset(uint256)`
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `uint256` | `_tokenId` |  |
---
#### <a name="isApprovedForAll(address,address)"></a> `isApprovedForAll(address,address)`
Tells whether an operator is approved by a given owner
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `address` | `owner` | owner address which you want to query the approval of |
| `1` | `address` | `operator` | operator address which you want to query the approval of |
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `bool` |  |  |
---
#### <a name="isOwner()"></a> `isOwner()`
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `bool` |  |  |
---
#### <a name="mint(address,string,uint256)"></a> `mint(address,string,uint256)`
Mint a token
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `address` | `_to` | The receiver of the token |
| `1` | `string` | `_tokenURI` | The tokenURI of the the tokenURI |
| `2` | `uint256` | `_sunsetLength` | The length (in seconds) that a sunset period can last |
---
#### <a name="name()"></a> `name()`
Gets the token name
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `string` |  |  |
---
#### <a name="nextTokenId()"></a> `nextTokenId()`
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `uint256` |  |  |
---
#### <a name="owner()"></a> `owner()`
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `address` |  |  |
---
#### <a name="ownerOf(uint256)"></a> `ownerOf(uint256)`
Gets the owner of the specified token ID
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `uint256` | `tokenId` | uint256 ID of the token to query the owner of |
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `address` |  |  |
---
#### <a name="OwnershipTransferred(address,address)"></a> `OwnershipTransferred(address,address)`
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `address` | `previousOwner` |  |
| `1` | `address` | `newOwner` |  |
---
#### <a name="redemptionCodeHash(uint256)"></a> `redemptionCodeHash(uint256)`
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `uint256` |  |  |
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `bytes32` |  |  |
---
#### <a name="redemptionCodeHashSubmittedAt(uint256)"></a> `redemptionCodeHashSubmittedAt(uint256)`
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `uint256` |  |  |
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `uint256` |  |  |
---
#### <a name="renounceOwnership()"></a> `renounceOwnership()`
Allows the current owner to relinquish control of the contract.
---
#### <a name="safeTransferFrom(address,address,uint256,bytes)"></a> `safeTransferFrom(address,address,uint256,bytes)`
Safely transfers the ownership of a given token ID to another address If the target address is a contract, it must implement `onERC721Received`, which is called upon a safe transfer, and return the magic value `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`; otherwise, the transfer is reverted. Requires the msg sender to be the owner, approved, or operator
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `address` | `from` | current owner of the token |
| `1` | `address` | `to` | address to receive the ownership of the given token ID |
| `2` | `uint256` | `tokenId` | uint256 ID of the token to be transferred |
| `3` | `bytes` | `_data` | bytes data to send along with a safe transfer check |
---
#### <a name="safeTransferFrom(address,address,uint256)"></a> `safeTransferFrom(address,address,uint256)`
Safely transfers the ownership of a given token ID to another address If the target address is a contract, it must implement `onERC721Received`, which is called upon a safe transfer, and return the magic value `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`; otherwise, the transfer is reverted.   * Requires the msg sender to be the owner, approved, or operator
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `address` | `from` | current owner of the token |
| `1` | `address` | `to` | address to receive the ownership of the given token ID |
| `2` | `uint256` | `tokenId` | uint256 ID of the token to be transferred |
---
#### <a name="setApprovalForAll(address,bool)"></a> `setApprovalForAll(address,bool)`
Sets or unsets the approval of a given operator An operator is allowed to transfer all tokens of the sender on their behalf
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `address` | `to` | operator address to set the approval |
| `1` | `bool` | `approved` | representing the status of the approval to be set |
---
#### <a name="setTokenURI(uint256,string)"></a> `setTokenURI(uint256,string)`
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `uint256` | `_tokenId` |  |
| `1` | `string` | `_tokenURI` |  |
---
#### <a name="submitRedemptionCodeHash(uint256,bytes32)"></a> `submitRedemptionCodeHash(uint256,bytes32)`
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `uint256` | `_tokenId` |  |
| `1` | `bytes32` | `_redemptionCodeHash` |  |
---
#### <a name="sunsetInitiatedAt(uint256)"></a> `sunsetInitiatedAt(uint256)`
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `uint256` |  |  |
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `uint256` |  |  |
---
#### <a name="sunsetLength(uint256)"></a> `sunsetLength(uint256)`
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `uint256` |  |  |
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `uint256` |  |  |
---
#### <a name="supportsInterface(bytes4)"></a> `supportsInterface(bytes4)`
implement supportsInterface(bytes4) using a lookup table
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `bytes4` | `interfaceId` |  |
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `bool` |  |  |
---
#### <a name="symbol()"></a> `symbol()`
Gets the token symbol
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `string` |  |  |
---
#### <a name="tokenURI(uint256)"></a> `tokenURI(uint256)`
Returns an URI for a given token ID Throws if the token ID does not exist. May return an empty string.
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `uint256` | `tokenId` | uint256 ID of the token to query |
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `string` |  |  |
---
#### <a name="totalSupply()"></a> `totalSupply()`
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `uint256` |  |  |
---
#### <a name="Transfer(address,address,uint256)"></a> `Transfer(address,address,uint256)`
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `address` | `from` |  |
| `1` | `address` | `to` |  |
| `2` | `uint256` | `tokenId` |  |
---
#### <a name="transferFrom(address,address,uint256)"></a> `transferFrom(address,address,uint256)`
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `address` | `_from` |  |
| `1` | `address` | `_to` |  |
| `2` | `uint256` | `_tokenId` |  |
---
#### <a name="transferOwnership(address)"></a> `transferOwnership(address)`
Allows the current owner to transfer control of the contract to a newOwner.
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `address` | `newOwner` | The address to transfer ownership to. |
---