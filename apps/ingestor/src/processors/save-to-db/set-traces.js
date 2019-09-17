import { utils } from 'web3';
class SetTrace {
  constructor(web3) {
    this.web3 = web3;
  }

  set(block) {
    return new Promise(resolve => {
      this.web3.trace.traceBlockRaw(utils.toHex(block.number)).then(traces => {
        const txHashTraces = {};
        traces.forEach(trace => {
          if (txHashTraces[trace.transactionHash])
            txHashTraces[trace.transactionHash].push(trace);
          else txHashTraces[trace.transactionHash] = [trace];
        });
        block.transactions.forEach(tx => {
          tx.trace = txHashTraces[tx.hash];
        });
        resolve(block);
      });
    });
  }
}
export default SetTrace;
