import { Tx } from 'ethvm-common'

const toTx = (tx: any): Tx => {
  const t: any = {}
  t.logs = {}
  if (tx.logs.address) {
    t.logs.address = tx.logs.address
  }
  if (tx.logs.topics) {
    const topics: string[] = []
    t.topics.forEach(topic => {
      topics.push(topic.buffer)
    })
    t.logs.topics = topics
  }
  if (tx.logs.data) {
    t.logs.data = tx.logs.data.buffer
  }

  t.traces = []
  tx.traces.forEach(trace => {
    if (trace.parentHash) {
      trace.parentHash = trace.parentHash
    }
    if (trace.hash) {
      trace.hash = trace.hash
    }
    if (trace.opcode) {
      trace.opcode = trace.opcode
    }
    if (trace.deep) {
      trace.deep = trace.deep
    }
    if (trace.index) {
      trace.index = trace.index
    }
    if (trace.rejected) {
      trace.rejected = trace.rejected
    }
    if (trace.from) {
      trace.from = trace.from.buffer
    }
    if (trace.to) {
      trace.to = trace.to.buffer
    }
    if (trace.value) {
      trace.value = trace.value.buffer
    }
    if (trace.data) {
      trace.data = trace.data.buffer
    }
    if (trace.gas) {
      trace.gas = trace.gas.buffer
    }
    if (trace.gasPrice) {
      trace.gasPrice = trace.gasPrice.buffer
    }
    if (trace.nonce) {
      trace.nonce = trace.nonce.buffer
    }
    t.traces.push(trace)
  })

  if (tx.blockHash) {
    t.blockHash = tx.blockHash
  }
  if (tx.blockNumber) {
    t.blockNumber = tx.blockNumber
  }
  if (tx.hash) {
    t.hash = tx.hash
  }
  if (tx.timestamp) {
    t.timestamp = tx.timestamp
  }
  if (tx.nonce) {
    t.nonce = tx.nonce
  }

  if (tx.from) {
    t.from = tx.from
  }
  if (tx.to) {
    t.to = tx.to
  }
  if (tx.contractAddress) {
    t.contractAddress = tx.contractAddress
  }

  t.status = tx.status

  if (tx.data) {
    t.data = tx.data.buffer
  }
  if (tx.fee) {
    t.fee = parseFloat(tx.fee)
  }
  if (tx.result) {
    t.result = tx.result
  }
  if (tx.gasPrice) {
    t.gasPrice = parseFloat(tx.gasPrice)
  }
  if (tx.gasLimit) {
    t.gasLimit = parseFloat(tx.gasLimit)
  }

  if (tx.gasUsed) {
    t.gasUsed = parseFloat(tx.gasUsed)
  }
  if (tx.gasRefund) {
    t.gasRefund = parseFloat(tx.gasRefund)
  }
  if (tx.gasLeftover) {
    t.gasLeftover = parseFloat(tx.gasLeftover)
  }

  if (tx.v) {
    t.v = tx.v
  }
  if (tx.r) {
    t.r = parseFloat(tx.r)
  }
  if (tx.s) {
    t.s = parseFloat(tx.s)
  }
  if (tx.value) {
    t.value = tx.value.buffer
  }

  return t
}

export { toTx }
