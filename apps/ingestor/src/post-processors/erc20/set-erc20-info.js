import erc20abi from './abi'
import { utils } from 'web3'
const ERC_20_TRANSFER_EVENT = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'

class SetERC20Info {
  constructor(web3) {
    this.web3 = web3
  }

  process(block) {
    return new Promise((resolve, reject) => {
      if (block.transactions.length === 0) return resolve([])
      else {
        const erc20Contract = new this.web3.eth.Contract(erc20abi)
        const requests = []
        const transfers = []
        for (const i in block.transactions) {
          const tx = block.transactions[i]
          tx.logs.forEach((log, eventIdx) => {
            if (log.topics.length === 3 && log.topics[0] === ERC_20_TRANSFER_EVENT) {
              var from = '0x' + log.topics[1].substr(log.topics[1].length - 40)
              var to = '0x' + log.topics[2].substr(log.topics[2].length - 40)
              var value = '0x' + log.data.replace('0x', '').replace(/^0+/, '')
              const contract = log.address
              const blockNumber = block.number
              const txFee = utils.toHex(utils.toBN(tx.gasUsed).mul(utils.toBN(tx.gasPrice)))
              transfers.push({
                transactionHash: tx.hash,
                timestamp: block.timestamp,
                from,
                to,
                value,
                txFee,
                before: {
                  from: '0x00',
                  to: '0x00'
                },
                contract,
                block: blockNumber
              })
              requests.push({
                method: 'eth_call',
                params: [{ to: contract, data: erc20Contract.methods.balanceOf(from).encodeABI() }, utils.toHex(utils.toBN(block.number - 1))],
                id: `${block.transactions[i].hash}-${i}-${eventIdx}`,
                jsonrpc: '2.0'
              })
              requests.push({
                method: 'eth_call',
                params: [{ to: contract, data: erc20Contract.methods.balanceOf(to).encodeABI() }, utils.toHex(utils.toBN(block.number - 1))],
                id: `${block.transactions[i].hash}-${i}-${eventIdx}`,
                jsonrpc: '2.0'
              })
            }
          })
        }
        if (requests.length) {
          this.web3.currentProvider.send(requests, (err, result) => {
            if (!err) {
              if (result.length !== 2 * transfers.length) return reject(new Error('most likely chain forked'))
              for (let i = 0; i < result.length; i += 2) {
                transfers[parseInt(i / 2)].before.from = result[i].result
                transfers[parseInt(i / 2)].before.to = result[i + 1].result
              }
              resolve(transfers)
            } else {
              reject(err)
            }
          })
        } else {
          resolve([])
        }
      }
    })
  }
}

export default SetERC20Info
