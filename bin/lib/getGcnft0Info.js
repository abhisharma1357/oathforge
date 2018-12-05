let gc0

module.exports = function getgc0Info() {
  if (gc0) {
    return gc0
  }
  console.log('Compiling gcNFT0...'.cyan)
  gc0  = require('../../')
  console.log('Compiling gcNFT0 complete'.green)
  return gc0
}
