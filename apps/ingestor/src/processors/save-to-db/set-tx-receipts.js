class SetTxReceipts {
  constructor(web3) {
    this.web3 = web3
  }

  set(block) {
    return new Promise((resolve, reject) => {
      if (block.transactions.length === 0) resolve(block)
      else {
        const requests = []
        for (const i in block.transactions) {
          requests.push({
            method: 'eth_getTransactionReceipt',
            params: [block.transactions[i].hash],
            id: block.transactions[i].hash,
            jsonrpc: '2.0'
          })
        }
        this.web3.currentProvider.send(requests, (err, result) => {
          if (!err) {
            if (result.length !== block.transactions.length) return reject(new Error('most likely chain forked'))
            result.forEach((_txReceipt, idx) => {
              if (!_txReceipt.result || block.transactions[idx].hash !== _txReceipt.result.transactionHash)
                return reject(new Error('most likely chain forked 2'))
              block.transactions[idx] = Object.assign(block.transactions[idx], _txReceipt.result)
            })
            resolve(block)
          }
        })
      }
    })
  }
}

export default SetTxReceipts
