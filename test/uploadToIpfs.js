const uploadToIpfs = require('../bin/lib/uploadToIpfs')

describe('uplaodToIpfs', () => {
  const file = new Uint8Array([0, 1, 2])

  it('should uplaod to ipfs', () => {
    return uploadToIpfs(file)
  })
})
