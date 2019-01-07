# NFT Token Registry
Author: GuildCrypt


| Name | Type |
|---|---|
| [`Approval(address,address,uint256)`](#Approval(address,address,uint256)) | event |
| [`ApprovalForAll(address,address,bool)`](#ApprovalForAll(address,address,bool)) | event |
| [`approve(address,uint256)`](#approve(address,uint256)) | function (non-constant) |
| [`balanceOf(address)`](#balanceOf(address)) | function (constant) |
| [`constructor(string,string)`](#constructor(string,string)) | constructor |
| [`getApproved(uint256)`](#getApproved(uint256)) | function (constant) |
| [`initiateSunset(uint256)`](#initiateSunset(uint256)) | function (non-constant) |
| [`isApprovedForAll(address,address)`](#isApprovedForAll(address,address)) | function (constant) |
| [`isOwner()`](#isOwner()) | function (constant) |
| [`mint(address,string,uint256)`](#mint(address,string,uint256)) | function (non-constant) |
| [`name()`](#name()) | function (constant) |
| [`nextTokenId()`](#nextTokenId()) | function (constant) |
| [`owner()`](#owner()) | function (constant) |
| [`ownerOf(uint256)`](#ownerOf(uint256)) | function (constant) |
| [`OwnershipTransferred(address,address)`](#OwnershipTransferred(address,address)) | event |
| [`redemptionCodeHash(uint256)`](#redemptionCodeHash(uint256)) | function (constant) |
| [`RedemptionCodeHashSubmitted(uint256,bytes32)`](#RedemptionCodeHashSubmitted(uint256,bytes32)) | event |
| [`redemptionCodeHashSubmittedAt(uint256)`](#redemptionCodeHashSubmittedAt(uint256)) | function (constant) |
| [`renounceOwnership()`](#renounceOwnership()) | function (non-constant) |
| [`safeTransferFrom(address,address,uint256,bytes)`](#safeTransferFrom(address,address,uint256,bytes)) | function (non-constant) |
| [`safeTransferFrom(address,address,uint256)`](#safeTransferFrom(address,address,uint256)) | function (non-constant) |
| [`setApprovalForAll(address,bool)`](#setApprovalForAll(address,bool)) | function (non-constant) |
| [`setTokenURI(uint256,string)`](#setTokenURI(uint256,string)) | function (non-constant) |
| [`submitRedemptionCodeHash(uint256,bytes32)`](#submitRedemptionCodeHash(uint256,bytes32)) | function (non-constant) |
| [`SunsetInitiated(uint256)`](#SunsetInitiated(uint256)) | event |
| [`sunsetInitiatedAt(uint256)`](#sunsetInitiatedAt(uint256)) | function (constant) |
| [`sunsetLength(uint256)`](#sunsetLength(uint256)) | function (constant) |
| [`supportsInterface(bytes4)`](#supportsInterface(bytes4)) | function (constant) |
| [`symbol()`](#symbol()) | function (constant) |
| [`tokenURI(uint256)`](#tokenURI(uint256)) | function (constant) |
| [`totalSupply()`](#totalSupply()) | function (constant) |
| [`Transfer(address,address,uint256)`](#Transfer(address,address,uint256)) | event |
| [`transferFrom(address,address,uint256)`](#transferFrom(address,address,uint256)) | function (non-constant) |
| [`transferOwnership(address)`](#transferOwnership(address)) | function (non-constant) |
#### <a name="Approval(address,address,uint256)"></a> `Approval(address,address,uint256)`
##### Inputs
|  | Type | Name | Description | Indexed? |
|---|---|---|---|---|
| `0` | `address` | `owner` |  | `true` |
| `1` | `address` | `approved` |  | `true` |
| `2` | `uint256` | `tokenId` |  | `true` |
---
#### <a name="ApprovalForAll(address,address,bool)"></a> `ApprovalForAll(address,address,bool)`
##### Inputs
|  | Type | Name | Description | Indexed? |
|---|---|---|---|---|
| `0` | `address` | `owner` |  | `true` |
| `1` | `address` | `operator` |  | `true` |
| `2` | `bool` | `approved` |  | `false` |
---
#### <a name="approve(address,uint256)"></a> `approve(address,uint256)`
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `address` | `to` | address to be approved for the given token ID |
| `1` | `uint256` | `tokenId` | uint256 ID of the token to be approved |
---
#### <a name="balanceOf(address)"></a> `balanceOf(address)`
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `address` | `owner` | address to query the balance of |
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `uint256` |  |  |
---
#### <a name="constructor(string,string)"></a> `constructor(string,string)`
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `string` | `name` |  |
| `1` | `string` | `symbol` |  |
---
#### <a name="getApproved(uint256)"></a> `getApproved(uint256)`
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
| `0` | `uint256` | `tokenId` | The id of the token |
---
#### <a name="isApprovedForAll(address,address)"></a> `isApprovedForAll(address,address)`
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
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `address` | `to` | The receiver of the token |
| `1` | `string` | `tokenURI` | The tokenURI of the the tokenURI |
| `2` | `uint256` | `__sunsetLength` | The length (in seconds) that a sunset period can last |
---
#### <a name="name()"></a> `name()`
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
|  | Type | Name | Description | Indexed? |
|---|---|---|---|---|
| `0` | `address` | `previousOwner` |  | `true` |
| `1` | `address` | `newOwner` |  | `true` |
---
#### <a name="redemptionCodeHash(uint256)"></a> `redemptionCodeHash(uint256)`
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `uint256` | `tokenId` | The token id |
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `bytes32` |  |  |
---
#### <a name="RedemptionCodeHashSubmitted(uint256,bytes32)"></a> `RedemptionCodeHashSubmitted(uint256,bytes32)`
##### Inputs
|  | Type | Name | Description | Indexed? |
|---|---|---|---|---|
| `0` | `uint256` | `tokenId` |  | `true` |
| `1` | `bytes32` | `redemptionCodeHash` |  | `false` |
---
#### <a name="redemptionCodeHashSubmittedAt(uint256)"></a> `redemptionCodeHashSubmittedAt(uint256)`
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `uint256` | `tokenId` | The token id |
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `uint256` |  |  |
---
#### <a name="renounceOwnership()"></a> `renounceOwnership()`
---
#### <a name="safeTransferFrom(address,address,uint256,bytes)"></a> `safeTransferFrom(address,address,uint256,bytes)`
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `address` | `from` | current owner of the token |
| `1` | `address` | `to` | address to receive the ownership of the given token ID |
| `2` | `uint256` | `tokenId` | uint256 ID of the token to be transferred |
| `3` | `bytes` | `_data` | bytes data to send along with a safe transfer check |
---
#### <a name="safeTransferFrom(address,address,uint256)"></a> `safeTransferFrom(address,address,uint256)`
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `address` | `from` | current owner of the token |
| `1` | `address` | `to` | address to receive the ownership of the given token ID |
| `2` | `uint256` | `tokenId` | uint256 ID of the token to be transferred |
---
#### <a name="setApprovalForAll(address,bool)"></a> `setApprovalForAll(address,bool)`
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
| `0` | `uint256` | `tokenId` | The id of the token |
| `1` | `string` | `tokenURI` | The token URI |
---
#### <a name="submitRedemptionCodeHash(uint256,bytes32)"></a> `submitRedemptionCodeHash(uint256,bytes32)`
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `uint256` | `tokenId` | The id of the token |
| `1` | `bytes32` | `__redemptionCodeHash` | The redemption code hash |
---
#### <a name="SunsetInitiated(uint256)"></a> `SunsetInitiated(uint256)`
##### Inputs
|  | Type | Name | Description | Indexed? |
|---|---|---|---|---|
| `0` | `uint256` | `tokenId` |  | `true` |
---
#### <a name="sunsetInitiatedAt(uint256)"></a> `sunsetInitiatedAt(uint256)`
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `uint256` | `tokenId` | The token id |
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `uint256` |  |  |
---
#### <a name="sunsetLength(uint256)"></a> `sunsetLength(uint256)`
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `uint256` | `tokenId` | The token id |
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `uint256` |  |  |
---
#### <a name="supportsInterface(bytes4)"></a> `supportsInterface(bytes4)`
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
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `string` |  |  |
---
#### <a name="tokenURI(uint256)"></a> `tokenURI(uint256)`
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
|  | Type | Name | Description | Indexed? |
|---|---|---|---|---|
| `0` | `address` | `from` |  | `true` |
| `1` | `address` | `to` |  | `true` |
| `2` | `uint256` | `tokenId` |  | `true` |
---
#### <a name="transferFrom(address,address,uint256)"></a> `transferFrom(address,address,uint256)`
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `address` | `from` | current owner of the token |
| `1` | `address` | `to` | address to receive the ownership of the given token ID |
| `2` | `uint256` | `tokenId` | uint256 ID of the token to be transferred |
---
#### <a name="transferOwnership(address)"></a> `transferOwnership(address)`
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `address` | `newOwner` | The address to transfer ownership to. |
---