import { utils } from 'web3'
import Configs from '../../configs'
import gethToParity from '../../helpers/geth-to-parity-trace'
import traceCode from '../../helpers/js-tracer'

class SetTrace {
  constructor(web3) {
    this.web3 = web3
  }

  set(block) {
    return new Promise(resolve => {
      if (!Configs.IS_GETH) {
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
      } else {
        this.web3.debug
          .traceBlockByNumber(utils.toHex(block.number), { tracer: traceCode })
          .then(traces => {
            const parityTraces = gethToParity(traces, block)
            const txHashTraces = {}
            parityTraces.forEach(trace => {
              if (txHashTraces[trace.transactionHash]) txHashTraces[trace.transactionHash].push(trace)
              else txHashTraces[trace.transactionHash] = [trace]
            })
            block.transactions.forEach(tx => {
              tx.trace = txHashTraces[tx.hash]
            })
            resolve(block)
          })
          .catch(err => {
            if (block.number === 0 && block.transactions.length === 0) {
              resolve(block)
            } else {
              throw err
            }
          })
      }
    })
  }
}

export default SetTrace
