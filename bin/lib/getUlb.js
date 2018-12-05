const Promise = require('bluebird')
const getProvider = require('./getProvider')
const amorphNumber = require('amorph-number')
const Ultralightbeam = require('ultralightbeam')

let ulb

module.exports = async function getUlb(network) {
  if (ulb) {
    return Promise.resolve(ulb)
  }
  console.log(`Checking ${network} network...`.cyan)
  return getProvider(network).then((provider) => {
    ulb = new Ultralightbeam(provider, {
      blockPollerInterval: 6000
    })
    return ulb.getLatestBlock()
  }).then((block) => {
    console.log(`${network} network: block #${block.number.to(amorphNumber.unsigned)}`.green)
    return ulb
  })
}
