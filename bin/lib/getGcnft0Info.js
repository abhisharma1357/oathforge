let gcnft0

module.exports = function getgcnft0Info() {
  if (gcnft0) {
    return gcnft0
  }
  console.log('Compiling gcNFT0...'.cyan)
  gcnft0  = require('../../')
  console.log('Compiling gcNFT0 complete'.green)
  return gcnft0
}
