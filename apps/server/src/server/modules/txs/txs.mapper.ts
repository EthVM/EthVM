import { Tx } from '@app/server/modules/txs'

const toTx = (tx: any): Tx => {
  const t: any = {}
  t.logs = {}
  if (tx.logs.address) {
    t.logs.address = tx.logs.address
  }
  if (tx.logs.topics) {
    const topics: string[] = []
    t.topics.forEach(topic => {
      topics.push(topic.buffer.toString('base64'))
    })
    t.logs.topics = topics
  }
  if (tx.logs.data) {
    t.logs.data = tx.logs.data.buffer.toString('base64')
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
      trace.from = trace.from.buffer.toString('base64')
    }
    if (trace.to) {
      trace.to = trace.to.buffer.toString('base64')
    }
    if (trace.value) {
      trace.value = trace.value.buffer.toString('base64')
    }
    if (trace.data) {
      trace.data = trace.data.buffer.toString('base64')
    }
    if (trace.gas) {
      trace.gas = trace.gas.buffer.toString('base64')
    }
    if (trace.gasPrice) {
      trace.gasPrice = trace.gasPrice.buffer.toString('base64')
    }
    if (trace.nonce) {
      trace.nonce = trace.nonce.buffer.toString('base64')
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

  if (tx.status) {
    t.status = tx.status
  }
  if (tx.data) {
    t.data = tx.data.buffer.toString('base64')
  }
  if (tx.fee) {
    t.fee = tx.fee.buffer.toString('base64')
  }
  if (tx.result) {
    t.result = tx.result
  }
  if (tx.gasPrice) {
    t.gasPrice = tx.gasPrice.buffer.toString('base64')
  }
  if (tx.gasLimit) {
    t.gasLimit = tx.gasLimit.buffer.toString('base64')
  }

  if (tx.gasUsed) {
    t.gasUsed = tx.gasUsed.buffer.toString('base64')
  }
  if (tx.gasRefund) {
    t.gasRefund = tx.gasRefund.buffer.toString('base64')
  }
  if (tx.gasLeftover) {
    t.gasLeftover = tx.gasLeftover.buffer.toString('base64')
  }

  if (tx.v) {
    t.v = tx.v
  }
  if (tx.r) {
    t.r = tx.r.buffer.toString('base64')
  }
  if (tx.s) {
    t.s = tx.s.buffer.toString('base64')
  }
  if (tx.value) {
    t.value = tx.value.buffer.toString('base64')
  }

  return t
}

export { toTx }
