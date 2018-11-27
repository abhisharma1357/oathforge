const Ipfs = require('ipfs')
const PromiseStub = require('bluebird-stub')
const request = require('request-promise')
const IpfsApi = require('ipfs-api')

const ipfs = new Ipfs
const ipfsApi = IpfsApi('cloudflare-ipfs.com', '8000', {protocol: 'https'})


const ipfsPromiseStub = new PromiseStub

ipfs.on('ready', ipfsPromiseStub.resolve)

module.exports = async function uploadToIpfs(file) {
  await ipfsPromiseStub.promise
  const results = await ipfsApi.files.add(new Buffer(file))
  console.log(`https://cloudflare-ipfs.com/ipfs/${results[0].hash}`)
  const fetchedFileBuffer = await request({
    url: `https://cloudflare-ipfs.com/ipfs/${results[0].hash}`,
    encoding: null
  })
  const fetchedFile = new Uint8Array(fetchedFileBuffer)
  if (fetchedFile.length !== file.length) {
    throw new Error('wrong file length')
  }
  fetchedFile.forEach((byte, index) => {
    if (file[index] !== byte) {
      throw new Error(`wrong byte at fetchedFile[${index}]`)
    }
  })
  return results[0].hash
}
