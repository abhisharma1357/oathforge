let oathForge

module.exports = function getoathForgeInfo() {
  if (oathForge) {
    return oathForge
  }
  console.log('Compiling gcNFT0...'.cyan)
  oathForge  = require('../../')
  console.log('Compiling gcNFT0 complete'.green)
  return oathForge
}
