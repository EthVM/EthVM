import fs from 'fs'
const test = (type, blockNumber) => {
  const fileIn = fs.readFileSync('block-erc20-' + blockNumber + '.json', 'utf-8')
  const blockTransfers = JSON.parse(fileIn)
  const BLOCK_NUMBER = parseInt(blockNumber)
  const transfers = blockTransfers[type]
  const uniqueTransfers = {}
  transfers.forEach(transfer => {
    if (type === 'ETH' && uniqueTransfers[transfer.transactionHash]) {
      uniqueTransfers[transfer.transactionHash].internal = true
      return
    }
    uniqueTransfers[transfer.transactionHash] = {
      hash: transfer.transactionHash,
      timestamp: transfer.timestamp,
      from: transfer.from,
      to: transfer.to,
      value: transfer.value,
      txFee: transfer.txFee,
      contract: transfer.contract,
      block: BLOCK_NUMBER
    }
  })
  const allTransfers = {}
  transfers.forEach(transfer => {
    allTransfers[`${transfer.from}-${type}`] = uniqueTransfers[transfer.transactionHash]
    allTransfers[`${transfer.to}-${type}`] = uniqueTransfers[transfer.transactionHash]
  })
  const transferKeys = Object.keys(allTransfers)
  // transferKeys.sort()
  console.log(transferKeys.length)
  const putTransfers = transferKeys.map(key => {
    const _transfer = Object.assign({}, allTransfers[key])
    _transfer.transfer = key
    return _transfer
  })
  putTransfers.forEach((_t, idx) => {
    console.log(_t.transfer, transferKeys[idx], idx)
  })
  // console.log(putTransfers)
  // console.log(putTransfers)
  // console.log(allTransfers);
  // console.log(transferKeys);
  // console.log(putTransfers);
}
test('ETH', '9898668')
