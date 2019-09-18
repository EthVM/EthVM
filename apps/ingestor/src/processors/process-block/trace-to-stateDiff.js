import { utils } from 'web3'

class SetTrace {
  constructor(web3) {
    this.web3 = web3
  }

  set(block) {
    return new Promise(resolve => {
      this.web3.trace.traceBlockRaw(utils.toHex(block.number)).then(traces => {
        const txHashTraces = {}
        traces.forEach(trace => {
          if (txHashTraces[trace.transactionHash]) txHashTraces[trace.transactionHash].push(trace)
          else txHashTraces[trace.transactionHash] = [trace]
        })
        block.transactions.forEach(tx => {
          tx.trace = txHashTraces[tx.hash]
        })
        resolve(block)
      })
    })
  }

  //   getTraceAndStateDiff(blockNum) {
  //     const prevBlockNum = blockNum === 0 ? 0 : blockNum - 1;
  //     this.web3.trace.traceBlockRaw(utils.toHex(blockNum)).then(traces => {
  //       const changedAddresses = {};
  //       const txTraces = {};
  //       traces.forEach(trace => {
  //         if (trace.transactionHash) {
  //           txTraces[trace.transactionHash]
  //             ? txTraces[trace.transactionHash].push(trace)
  //             : (txTraces[trace.transactionHash] = [trace]);
  //         }
  //         if (!trace.error) {
  //           if (trace.type === 'call' && trace.action.value !== '0x0') {
  //             changedAddresses[trace.action.from] = {};
  //             changedAddresses[trace.action.to] = {};
  //           } else if (trace.type === 'create' && trace.action.value !== '0x0') {
  //             changedAddresses[trace.action.from] = {};
  //             changedAddresses[trace.result.address] = {};
  //           } else if (
  //             trace.type === 'suicide' &&
  //             trace.action.balance !== '0x0'
  //           ) {
  //             changedAddresses[trace.action.address] = {};
  //             changedAddresses[trace.action.refundAddress] = {};
  //           } else if (
  //             trace.type === 'suicide' &&
  //             trace.action.balance !== '0x0'
  //           ) {
  //             changedAddresses[trace.action.address] = {};
  //             changedAddresses[trace.action.refundAddress] = {};
  //           }
  //           if (
  //             trace.type !== 'call' ||
  //             trace.type !== 'create' ||
  //             trace.type !== 'suicide'
  //           )
  //             throw new Error('Unknown trace', trace);
  //         }
  //       });
  //     });
  //   }
}
export default SetTrace
