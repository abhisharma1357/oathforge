const commander = require('commander')
const colors = require('colors')
const clear = require('clear')
const fs = require('fs')

const getUlb = require('./lib/getUlb')
const getGcnft0Info = require('./lib/getGcnft0Info')
const getAccount = require('./lib/getAccount')
const checkRuncode = require('./lib/checkRuncode')
const uploadToIpfs = require('./lib/uploadToIpfs')

const Amorph = require('amorph')
const amorphHex = require('amorph-hex')
const prompt = require('prompt-promise')
const SolWrapper = require('ultralightbeam/lib/SolWrapper')
const getRandomAmorph = require('ultralightbeam/lib/getRandomAmorph')
const amorphAscii = require('amorph-ascii')
const amorphNumber = require('amorph-number')

clear()

commander
  .version('0.0.0')
  .command('deploy <network>').action(async (network) => {
    const ulb = await getUlb(network)
    const gcnft0Info = getGcnft0Info()
    const account = await getAccount(network)

    console.log('Deploying gcNFT0...'.cyan)

    const timestamp = (new Date).getTime()
    const name = Amorph.from(amorphAscii, `GuildCryptNFT0Test${timestamp}`)
    const symbol = Amorph.from(amorphAscii, `GCNFT0TEST${timestamp}`)

    return ulb.solDeploy(gcnft0Info.code, gcnft0Info.abi, [name, symbol], {
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
    .command('mint <network> <id>').action(async (network, _tokenId) => {

      const tokenId = parseInt(_tokenId)

      if (tokenId === NaN) {
        throw new Error(`${_tokenId} is not a number`)
      }

      const imageFileBuffer = fs.readFileSync(`${__dirname}/../test/blacklotus.jpg`)
      const imageFile = new Uint8Array(imageFileBuffer)
      const imageMultihashB58 = await uploadToIpfs(imageFile)

      const account = await getAccount(network)
      const ulb = await getUlb(network)

      // const address = await recursivePrompt('contract address: ', (contractAddressHexUnprefixed) => {
      //   if (contractAddressHexUnprefixed.length !== 40) {
      //     throw new Error('contract address should be 40 characters long')
      //   }
      //   return Amorph.from(amorphHex.unprefixed, contractAddressHexUnprefixed)
      // })

      const address = Amorph.from(amorphHex.unprefixed, 'f7310922dAC1A8661332217FDF33aFbCD78041BB')

      await checkRuncode(network, address)

      const gcnft0Info = require('../')
      const gcnft0 = new SolWrapper(ulb, gcnft0Info.abi, address)

      // const receiverAddress = await recursivePrompt('receiver address: ', (receiverAddressHexUnprefixed) => {
      //   if (receiverAddressHexUnprefixed.length !== 40) {
      //     throw new Error('receiver address should be 40 characters long')
      //   }
      //   return Amorph.from(amorphHex.unprefixed, receiverAddressHexUnprefixed)
      // })

      const receiverAddress = Amorph.from(amorphHex.unprefixed, 'efc63ebf2e9b3e9bd98fcd83bb1e2798efccb6b9')

      const sunsetLengthNumberString = await prompt('sunset length (seconds): ')
      const sunsetLength = Amorph.from(amorphNumber.unsigned, parseInt(sunsetLengthNumberString))
      const name = await prompt('name: ')
      const description = await prompt('description: ')
      const metadataJson = JSON.stringify({
        name,
        description,
        image: `https://cloudflare-ipfs.com/ipfs/${imageMultihashB58}`
      })
      const mutlihashB58 = await uploadToIpfs(Buffer.from(metadataJson, 'ascii'))
      console.log(`https://cloudflare-ipfs.com/ipfs/${mutlihash}`)
      const tokenUri = Amorph.from(amorphAscii, `https://cloudflare-ipfs.com/ipfs/${mutlihashB58}`)

      console.log(`Minting token ${tokenId.to(amorphHex.unprefixed)} to ${receiverAddress.to(amorphHex.unprefixed)}...`.cyan)
      return gcnft0.broadcast('mint(address,uint256,string,uint256)', [receiverAddress, tokenId, tokenUri, sunsetLength], {
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
