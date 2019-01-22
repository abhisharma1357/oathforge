const chai = require('chai')

chai.use(require('chai-amorph'))
chai.use(require('chai-web3-bindings'))
chai.use(require('chai-as-promised'))
chai.should()

module.exports = chai
