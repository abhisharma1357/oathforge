const fs = require('fs')
const prompt = require('prompt-promise')
const Amorph = require('amorph')
const Account = require('ultralightbeam/lib/Account')
const amorphHex = require('amorph-hex')
const colors = require('colors')
const keythereum = require('keythereum')

module.exports = async function getAccount(keypath) {
  const keyObject = JSON.parse(fs.readFileSync(keypath))
  const password = await prompt.password('password: ')
  const privateKeyBuffer = keythereum.recover(password, keyObject);
  const privateKey = new Amorph(new Uint8Array(privateKeyBuffer))
  const account = new Account(privateKey)
  console.log(`Unlocked ${account.address.to(amorphHex.unprefixed)}`.green)
  return account
}
