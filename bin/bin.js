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
    const gcnft0Info = getGcnft0Info()

    console.log('Deploying gcNFT0...'.cyan)

    const timestamp = (new Date).getTime()
    const name = Amorph.from(amorphAscii, `GuildCrypt 0`)
    const symbol = Amorph.from(amorphAscii, `GC:0`)

    return ulb.solDeploy(gcnft0Info.code, gcnft0Info.abi, [name, symbol], {
      from: account
    }).then((gcnft0) => {
      console.log(`Deployed gcNFT0 to ${gcnft0.address.to(amorphHex.unprefixed)}`.green)
      return checkRuncode(network, gcnft0.address)
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

    const gcnft0Info = require('../')
    const gcnft0 = new SolWrapper(ulb, gcnft0Info.abi, contractAddress)

    const nextTokenId = await gcnft0.fetch('nextTokenId()', [])
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
    return gcnft0.broadcast('mint(address,string,uint256)', [receiverAddress, tokenUri, sunsetLength], {
      from: account
    }).getConfirmation().then(() => {
      console.log(`Confirming...`.cyan)
      return gcnft0.fetch('nextTokenId()', [])
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
    const gcnft0Info = require('../')
    const gcnft0 = new SolWrapper(ulb, gcnft0Info.abi, contractAddress)

    const nextTokenId = await gcnft0.fetch('nextTokenId()', [])
    const nextTokenIdNumber = nextTokenId.to(amorphNumber.unsigned)
    console.log(`Total supply: ${nextTokenIdNumber}`.green)

    for (let i = 0; i < nextTokenIdNumber; i++) {
      const tokenId = Amorph.from(amorphNumber.unsigned, i)
      console.log('================================')
      console.log(`Token id: ${nextTokenIdNumber}`)
      const sunsetLength = await gcnft0.fetch('sunsetLength(uint256)', [tokenId])
      console.log(`Sunset length: ${sunsetLength.to(amorphNumber.unsigned)}`)
    }
  })

commander
  .version('0.0.0')
  .command('abi').action(async () => {
    const gcnft0Info = require('../')
    console.log(JSON.stringify(gcnft0Info.abi))
  })

commander.parse(process.argv)
