const recursivePrompt = require('./recursivePrompt')
const Amorph = require('amorph')
const amorphHex = require('amorph-hex')

module.exports = async function recursivePromptAddress(input) {
  return recursivePrompt(input, (addressHex) => {
    if (addressHex.length != 40) {
      throw new Error('should be 40 characters long')
    }
  }).then((addressHex) => {
    return Amorph.from(amorphHex.unprefixed, addressHex)
  })
}
