import abi from 'ethereumjs-abi'
import { utils } from 'web3'
const ERC_721_TRANSFER_EVENT = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'

class SetERC721Info {
  process(block) {
    return new Promise((resolve, reject) => {
      if (block.transactions.length === 0) return resolve([])
      else {
        const transfers = []
        for (const i in block.transactions) {
          const tx = block.transactions[i]
          tx.logs.forEach((log, eventIdx) => {
            if (log.topics.length === 4 && log.topics[0] === ERC_721_TRANSFER_EVENT) {
              const from = '0x' + log.topics[1].substr(log.topics[1].length - 40)
              const to = '0x' + log.topics[2].substr(log.topics[2].length - 40)
              const tokenId = log.topics[3]
              const contract = log.address
              const blockNumber = block.number
              const txFee = utils.toHex(utils.toBN(tx.gasUsed).mul(utils.toBN(tx.gasPrice)))
              transfers.push({
                id: `${blockNumber}-erc721-${i}-${eventIdx}`,
                transactionHash: tx.hash,
                timestamp: block.timestamp,
                from,
                to,
                value: tokenId,
                txFee,
                contract,
                block: blockNumber
              })
            } else if (log.topics.length === 1 && log.topics[0] === ERC_721_TRANSFER_EVENT) {
              // crypto kitties
              const decoded = abi.rawDecode(['address', 'address', 'bytes32'], Buffer.from(log.data.replace('0x', ''), 'hex'))
              const from = '0x' + decoded[0]
              const to = '0x' + decoded[1]
              const tokenId = '0x' + decoded[2].toString('hex')
              const contract = log.address
              const blockNumber = block.number
              const txFee = utils.toHex(utils.toBN(tx.gasUsed).mul(utils.toBN(tx.gasPrice)))
              transfers.push({
                id: `${blockNumber}-erc721-${i}-${eventIdx}`,
                transactionHash: tx.hash,
                timestamp: block.timestamp,
                from,
                to,
                value: tokenId,
                txFee,
                contract,
                block: blockNumber
              })
            }
          })
        }
        resolve(transfers)
      }
    })
  }
}

export default SetERC721Info
