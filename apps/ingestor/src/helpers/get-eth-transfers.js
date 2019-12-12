import TraceTypes from './trace-types'
const getNumberOfErrorSkips = (traces, i) => {
  let tempSkips = traces[i].subtraces
  for (let j = i + 1; j <= i + tempSkips; j++) {
    if (traces[j].subtraces) {
      const skips = getNumberOfErrorSkips(traces, j)
      j += skips
      tempSkips += skips
    }
  }
  return tempSkips
}
const getValueTransfers = traces => {
  const transfers = []
  for (let i = 0; i < traces.length; i++) {
    if (traces[i].error) {
      const skips = getNumberOfErrorSkips(traces, i)
      i += skips
      continue
    } else {
      const trace = traces[i]
      if (trace.type === TraceTypes.CALL) {
        transfers.push({
          from: trace.action.from,
          to: trace.action.to,
          value: trace.action.callType === TraceTypes.CALL ? trace.action.value : '0x0',
          type: trace.type
        })
      } else if (trace.type === TraceTypes.CREATE || trace.type === TraceTypes.CREATE2) {
        transfers.push({
          from: trace.action.from,
          to: trace.result.address,
          value: trace.action.value,
          type: trace.type
        })
      } else if (trace.type === TraceTypes.SUICIDE) {
        transfers.push({
          from: trace.action.address,
          to: trace.action.refundAddress,
          value: trace.action.balance,
          type: trace.type
        })
      }
      if (
        trace.type !== TraceTypes.CALL &&
        trace.type !== TraceTypes.CREATE &&
        trace.type !== TraceTypes.SUICIDE &&
        trace.type !== TraceTypes.STATICCALL &&
        trace.type !== TraceTypes.CREATE2 &&
        trace.type !== TraceTypes.DELEGATECALL
      )
        throw new Error('unknownTrace: ' + JSON.stringify(trace))
    }
  }
  return transfers
}

export default getValueTransfers
