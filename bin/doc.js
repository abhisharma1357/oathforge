const output = require('../output')
const solspecdown = require('solspecdown')
const fs = require('fs')

fs.writeFileSync('README.md', solspecdown(output.contracts['oathForge.sol:oathForge']))
