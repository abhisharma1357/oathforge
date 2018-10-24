const ganache = require('ganache-cli')
const getRandomAmorph = require('ultralightbeam/lib/getRandomAmorph')
const Promise = require('bluebird')
const Web3HttpProvider = require('web3-providers-http')
const amorphNumber = require('amorph-number')
const amorphHex = require('amorph-hex')
const getAccount = require('./getAccount')

let provider

module.exports = async function getProvider(network) {
  if (provider) {
    return Promise.resolve(provider)
  }

  if (network === 'local') {
    return getAccount('local').then((account) => {
      return ganache.provider({
        gasPrice: 20000000000,
        gasLimit: 8000000,
        blocktime: 2,
        accounts: [{
          secretKey: account.privateKey.to(amorphHex.prefixed),
          balance: getRandomAmorph(16).to(amorphNumber.unsigned)
        }]
      })
    })
  }

  const web3HttpProvider = new Web3HttpProvider(`https://${network}.infura.io/v3/ddf5fd9bc2314199814e9398df57f486`)
  web3HttpProvider.sendAsync = web3HttpProvider.send
  return Promise.resolve(web3HttpProvider)

}
