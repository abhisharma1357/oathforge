const ganache = require('ganache-cli')
const getRandomAmorph = require('ultralightbeam/lib/getRandomAmorph')
const Promise = require('bluebird')
const Web3HttpProvider = require('web3-providers-http')
const amorphNumber = require('amorph-number')
const amorphHex = require('amorph-hex')

let provider

module.exports = async function getProvider(network) {
  if (provider) {
    return Promise.resolve(provider)
  }

  const web3HttpProvider = new Web3HttpProvider(`https://${network}.infura.io/v3/ddf5fd9bc2314199814e9398df57f486`)
  web3HttpProvider.sendAsync = web3HttpProvider.send
  return Promise.resolve(web3HttpProvider)

}
