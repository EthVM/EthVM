class SetTxReceipts {
  constructor(web3) {
    this.web3 = web3;
  }

  set(block) {
    return new Promise(resolve => {
      if (block.transactions.length === 0) resolve(block);
      else {
        const requests = [];
        for (const i in block.transactions) {
          requests.push({
            method: 'eth_getTransactionReceipt',
            params: [block.transactions[i].hash],
            id: block.transactions[i].hash,
            jsonrpc: '2.0'
          });
        }
        this.web3.currentProvider.send(requests, (err, result) => {
          if (!err) {
            result.forEach((_txReceipt, idx) => {
              block.transactions[idx] = Object.assign(
                block.transactions[idx],
                _txReceipt.result
              );
            });
            resolve(block);
          }
        });
      }
    });
  }
}
export default SetTxReceipts;
