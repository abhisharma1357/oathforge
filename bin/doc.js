const output = require('../output')
const solspecdown = require('solspecdown')
const fs = require('fs')

fs.writeFileSync('README.md', solspecdown(output.contracts['GC0.sol:GC0']))
