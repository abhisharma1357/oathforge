const Ultralightbeam = require('ultralightbeam')
const ganache = require('ganache-cli')
const accounts = require('./accounts')
const amorphNumber = require('amorph-number')
const amorphHex = require('amorph-hex')
const getRandomAmorph = require('ultralightbeam/lib/getRandomAmorph')

const provider = ganache.provider({
  gasPrice: 20000000000,
  gasLimit: 8000000,
  blocktime: 2,
  accounts: accounts.map((account) => {
    return {
      secretKey: account.privateKey.to(amorphHex.prefixed),
      balance: getRandomAmorph(16).to(amorphNumber.unsigned)
    }
  })
})
const ultralightbeam = new Ultralightbeam(provider)

module.exports = ultralightbeam
