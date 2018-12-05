const commander = require('commander')
const colors = require('colors')
const clear = require('clear')
const fs = require('fs')

const getUlb = require('./lib/getUlb')
const getGcnft0Info = require('./lib/getGcnft0Info')
const checkRuncode = require('./lib/checkRuncode')
const recursivePrompt = require('./lib/recursivePrompt')
const recursivePromptAddress = require('./lib/recursivePromptAddress')
const getAccount = require('./lib/getAccount')

const Amorph = require('amorph')
const amorphHex = require('amorph-hex')
const prompt = require('prompt-promise')
const SolWrapper = require('ultralightbeam/lib/SolWrapper')
const getRandomAmorph = require('ultralightbeam/lib/getRandomAmorph')
const amorphAscii = require('amorph-ascii')
const amorphNumber = require('amorph-number')
const keythereum = require('keythereum')
const Account = require('ultralightbeam/lib/Account')


console.log("\r\n\r\n\r\n\r\n\r\n")

commander
  .version('0.0.0')
  .command('deploy <keypath>').action(async (keypath) => {

    const account = await getAccount(keypath)

    const network = await recursivePrompt('network: ', (network) => {
      if (network !== 'rinkeby' && network !== 'mainnet') {
        throw new Error('only rinkeby & mainnet supported')
      }
    })

    const ulb = await getUlb(network)
    const gc0Info = getGcnft0Info()

    console.log('Deploying gcNFT0...'.cyan)

    const timestamp = (new Date).getTime()
    const name = Amorph.from(amorphAscii, `GuildCrypt 0`)
    const symbol = Amorph.from(amorphAscii, `GC:0`)

    return ulb.solDeploy(gc0Info.code, gc0Info.abi, [name, symbol], {
      from: account
    }).then((gc0) => {
      console.log(`Deployed gcNFT0 to ${gc0.address.to(amorphHex.unprefixed)}`.green)
      return checkRuncode(network, gc0.address)
    }).then(() => {
      process.exit()
    })
  })

commander
  .version('0.0.0')
  .command('mint <keypath>').action(async (keypath) => {

    const account = await getAccount(keypath)

    const network = await recursivePrompt('network: ', (network) => {
      if (network !== 'rinkeby' && network !== 'mainnet') {
        throw new Error('only rinkeby & mainnet supported')
      }
    })
    const ulb = await getUlb(network)

    const contractAddress = await recursivePromptAddress('contract address (hex): ')

    await checkRuncode(network, contractAddress)

    const gc0Info = require('../')
    const gc0 = new SolWrapper(ulb, gc0Info.abi, contractAddress)

    const nextTokenId = await gc0.fetch('nextTokenId()', [])
    const nextTokenIdNumber = nextTokenId.to(amorphNumber.unsigned)

    console.log(`Total supply is currently ${nextTokenIdNumber}`.cyan)

    const receiverAddress = await recursivePromptAddress('receiver address (hex): ')

    const sunsetLengthString = await recursivePrompt('sunset length (seconds): ', (sunsetLengthString) => {
      if (parseInt(sunsetLengthString) === NaN) {
        throw new Error('should be a number')
      }
    })
    const sunsetLength = Amorph.from(amorphNumber.unsigned, parseInt(sunsetLengthString))

    const tokenUriString = await prompt('token uri: ')
    const tokenUri = Amorph.from(amorphAscii, tokenUriString)

    console.log(`Minting token to ${receiverAddress.to(amorphHex.unprefixed)}...`.cyan)
    return gc0.broadcast('mint(address,string,uint256)', [receiverAddress, tokenUri, sunsetLength], {
      from: account
    }).getConfirmation().then(() => {
      console.log(`Confirming...`.cyan)
      return gc0.fetch('nextTokenId()', [])
    }).then((_nextTokenId) => {
      const _nextTokenIdNumber = _nextTokenId.to(amorphNumber.unsigned)
      if (nextTokenIdNumber + 1 === _nextTokenIdNumber) {
        console.log('Token successfully minted!'.cyan)
        process.exit()
      } else {
        console.log(`Something went wrong. Total supply should be ${nextTokenIdNumber + 1 } not ${_nextTokenIdNumber}`.red)
        process.exit()
      }
    })

  })

commander
  .version('0.0.0')
  .command('stats').action(async () => {
    const ulb = await getUlb('mainnet')
    const contractAddress = await recursivePromptAddress('contract address: ')
    const gc0Info = require('../')
    const gc0 = new SolWrapper(ulb, gc0Info.abi, contractAddress)

    const totalSupply = await gc0.fetch('totalSupply()', [])
    const totalSupplyNumber = totalSupply.to(amorphNumber.unsigned)
    console.log(`Total supply: ${totalSupplyNumber}`.green)

    for (let i = 0; i < 3; i++) {
      const tokenId = Amorph.from(amorphNumber.unsigned, i)
      console.log('================================')
      console.log(`Token id: ${tokenId.to(amorphNumber.unsigned)}`)
      const sunsetLength = await gc0.fetch('sunsetLength(uint256)', [tokenId])
      console.log(`Sunset length: ${sunsetLength.to(amorphNumber.unsigned)}`)
      const owner = await gc0.fetch('ownerOf(uint256)', [tokenId])
      console.log(`Owner: ${owner.to(amorphHex.unprefixed)}`)
      const redemptionCodeHashSubmittedAt = await gc0.fetch('redemptionCodeHashSubmittedAt(uint256)', [tokenId])
      console.log(`Redemption Code Submitted At: ${redemptionCodeHashSubmittedAt.to(amorphNumber.unsigned)}`)
      const redemptionCodeHash = await gc0.fetch('redemptionCodeHash(uint256)', [tokenId])
      console.log(`Redemption Code: ${redemptionCodeHash.to(amorphHex.unprefixed)}`)
    }
    process.exit()
  })

commander
  .version('0.0.0')
  .command('abi').action(async () => {
    const gc0Info = require('../')
    console.log(JSON.stringify(gc0Info.abi))
  })

commander.parse(process.argv)
