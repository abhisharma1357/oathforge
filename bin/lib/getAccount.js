const Account = require('ultralightbeam/lib/Account')
const Amorph = require('amorph')
const amorphHex = require('amorph-hex')
const Promise = require('bluebird')
const prompt = require('prompt-promise')
const fs = require('fs')

let account

module.exports = async function getAccount(network) {
  if (account) {
    return Promise.resolve(account)
  }
  if (network === 'local') {
    account = Account.generate()
    return Promise.resolve(account)
  }
  const privateKeyHexUnprefixed = fs.readFileSync(`${__dirname}/../../secrets/privateKeyHexUnprefixed.txt`, 'utf8').trim()
  if (privateKeyHexUnprefixed.length !== 64) {
    console.log('Invalid private key length (should be 40 characters)'.red)
    return getAccount(network)
  }
  const privateKey =  Amorph.from(amorphHex.unprefixed, privateKeyHexUnprefixed)
  account = new Account(privateKey)
  return prompt(`Address is ${account.address.to(amorphHex.prefixed)}, correct? (y/n): `).then((response) => {
    prompt.end()
    if (response !== 'y') {
      console.log('Incorrect address, exiting'.red)
      process.exit()
    }
    return account
  })
}
