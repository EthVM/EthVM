import fs from 'fs'
import Web3 from 'web3'
var content = fs.readFileSync('response-geth.json')

const getTraceObj = trace => {
  return {
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

const web3 = new Web3()
web3.eth.getBlock(8576390, true).then(block => {
  console.log(gethToParity(JSON.parse(content).result, block))
})
// export default gethToParity;
// {
//          "action":{
//             "callType":"call",
//             "from":"0xa2d6be7c9ff2e565d299afc7259aacad13ece4fa",
//             "gas":"0x81018",
//             "input":"0x010028d394000000840022b10000000000000001",
//             "to":"0x0000000000c90bc353314b6911180ed7e06019a9",
//             "value":"0x0"
//          },
//          "blockHash":"0xda0be61fcc2d540d5d5f8c3a2a5163de5e97407ce6cb6834abe8ba9a52920616",
//          "blockNumber":8576340,
//          "result":{
//             "gasUsed":"0x6ce09",
//             "output":"0x0000000000000000000000000000000000000000000000000000000000000000"
//          },
//          "subtraces":5,
//          "traceAddress":[

//          ],
//          "transactionHash":"0x5776106d872b9b067c368f2d81d4371d2e20b3202c250ed446f3ad6da3ec48d3",
//          "transactionPosition":18,
//          "type":"call"
//       }
