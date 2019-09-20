const getTraceObj = trace => {
  if (trace.type === 'SELFDESTRUCT') trace.type = 'suicide'
  const obj = {
    action: {
      callType: trace.type.toLowerCase(),
      from: trace.from,
      gas: trace.gas,
      input: trace.input,
      to: trace.to,
      value: trace.value
    },
    type: trace.type.toLowerCase(),
    result: {
      gasUsed: trace.gasUsed,
      output: trace.output
    }
  }
  if (obj.type === 'create') obj.result.address = obj.action.to
  if (obj.type === 'suicide') {
    obj.action.refundAddress = obj.action.to
    obj.action.balance = obj.action.value
    delete obj.result
  }
  if (trace.error) obj.error = trace.error
  return obj
}
const getTraces = gethTrace => {
  let traces = []
  if (Array.isArray(gethTrace)) {
    gethTrace.forEach(trace => {
      traces = traces.concat(getTraces(trace))
    })
    return traces
  } else {
    const trace = getTraceObj(gethTrace)
    if (gethTrace.calls) {
      trace.subtraces = gethTrace.calls.length
      traces.push(trace)
      traces = traces.concat(getTraces(gethTrace.calls))
    } else {
      traces.push(trace)
    }
    return traces
  }
}
const gethToParity = (gethTraces, block) => {
  let parityTraces = []
  if (gethTraces.length !== block.transactions.length) throw new Error('Transaction count doesnt match')
  gethTraces.forEach((trace, idx) => {
    const allTraces = getTraces(trace.result)
    allTraces.forEach(subTrace => {
      subTrace.blockHash = block.hash
      subTrace.blockNumber = block.number
      subTrace.transactionHash = block.transactions[idx].hash
      subTrace.transactionPosition = idx
    })
    parityTraces = parityTraces.concat(allTraces)
  })
  return parityTraces
}
export default gethToParity
