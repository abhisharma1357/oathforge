require('./chai')
require('colors')

process.on('uncaughtException', (error) => {
  console.log(error.message.red)
  throw error
})
