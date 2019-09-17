import { utils } from 'web3';
class SetStateChanges {
  constructor(web3) {
    this.web3 = web3;
  }

  set(block) {
    return new Promise(resolve => {
      this.web3.trace
        .traceBlock(utils.toHex(block.number), ['stateDiff', 'trace'])
        .then(result => {
          const traces = result;
          traces.forEach(trace => {
            block.transactions = block.transactions.map(tx => {
              if (tx.hash === trace.transactionHash) {
                tx.stateDiff = trace.stateDiff;
                tx.trace = trace.trace;
                return tx;
              }
              return tx;
            });
          });
          resolve(block);
        });
    });
  }
}
export default SetStateChanges;
