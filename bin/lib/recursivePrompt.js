const prompt = require('prompt-promise')

module.exports = async function recursivePrompt(input, test) {
  return prompt(input).then((response) => {
    try {
      test(response)
      return response
    } catch(e) {
      console.log(e.message.red)
      return recursivePrompt(input, test)
    }
  })
}
