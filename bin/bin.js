const commander = require('commander')
const colors = require('colors')
const clear = require('clear')

const getUlb = require('./lib/getUlb')
const getGcnft0Info = require('./lib/getGcnft0Info')
const getAccount = require('./lib/getAccount')
const checkRuncode = require('./lib/checkRuncode')

const Amorph = require('amorph')
const amorphHex = require('amorph-hex')
const prompt = require('prompt-promise')
const SolWrapper = require('ultralightbeam/lib/SolWrapper')
const getRandomAmorph = require('ultralightbeam/lib/getRandomAmorph')

clear()

commander
  .version('0.0.0')
  .command('deploy <network>').action(async (network) => {
    const ulb = await getUlb(network)
    const gcnft0Info = getGcnft0Info()
    const account = await getAccount(network)

    console.log('Deploying gcNFT0...'.cyan)

    return ulb.solDeploy(gcnft0Info.code, gcnft0Info.abi, [], {
      from: account
    }).then((gcnft0) => {
      console.log(`Deployed gcNFT0 to ${gcnft0.address.to(amorphHex.unprefixed)}`.green)
      return checkRuncode(network, gcnft0.address)
    }).then(() => {
      process.exit()
    })
  })

  async function recursivePrompt(input, callback) {
    return prompt(input).then((response) => {
      try {
        return callback(response)
      } catch(e) {
        console.log(e.message.red)
        return recursivePrompt(input, callback)
      }
    })
  }

  commander
    .version('0.0.0')
    .command('mint <network>').action(async (network) => {

      const ulb = await getUlb(network)

      const address = await recursivePrompt('contract address: ', (contractAddressHexUnprefixed) => {
        if (contractAddressHexUnprefixed.length !== 40) {
          throw new Error('contract address should be 40 characters long')
        }
        return Amorph.from(amorphHex.unprefixed, contractAddressHexUnprefixed)
      })

      await checkRuncode(network, address)

      const gcnft0Info = require('../')

      const account = await getAccount(network)
      const gcnft0 = new SolWrapper(ulb, gcnft0Info.abi, address)

      const tokenId = getRandomAmorph(32)
      const receiverAddress = await recursivePrompt('receiver address: ', (receiverAddressHexUnprefixed) => {
        if (receiverAddressHexUnprefixed.length !== 40) {
          throw new Error('receiver address should be 40 characters long')
        }
        return Amorph.from(amorphHex.unprefixed, receiverAddressHexUnprefixed)
      })

      console.log(`Minting token ${tokenId.to(amorphHex.unprefixed)} to ${receiverAddress.to(amorphHex.unprefixed)}...`.cyan)
      return gcnft0.broadcast('mint(uint256,address)', [tokenId, receiverAddress], {
        from: account
      }).getConfirmation().then(() => {
        console.log(`Confirming...`.cyan)
        return gcnft0.fetch('ownerOf(uint256)', [tokenId])
      }).then((owner) => {
        if (owner.equals(receiverAddress)) {
          console.log('Token successfully minted!'.cyan)
          process.exit()
        } else {
          console.log('Something went wrong...'.red)
          process.exit()
        }
      })

    })

commander.parse(process.argv)
