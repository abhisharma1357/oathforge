const getUlb = require('./getUlb')
const getGcnft0Info = require('./getGcnft0Info')

module.exports = async function checkRuncode(network, address) {
  console.log('Checking runcode...'.cyan)

  const ulb = await getUlb(network)
  const runcode = await ulb.eth.getCode(address)
  const gc0Info = getGcnft0Info()

  if (runcode.equals(gc0Info.runcode)) {
    console.log(`Runcode matches`.green)
  } else {
    console.log('Runcode does not match. Something is wrong'.red)
    process.exit()
  }
}
