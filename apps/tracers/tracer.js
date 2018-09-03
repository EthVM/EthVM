var t = {
  transfers: [],
  isError: false,
  msg: '',

  result: function() {
    return {
      transfers: this.transfers,
      isError: this.isError,
      msg: this.msg
    }
  },

  step: function(log, db) {
    if (log.err) {
      this.isError = true
      this.msg = log.err.Error()
      return
    }

    var op = log.op
    var stack = log.stack
    var memory = log.memory
    var transfer = {}
    var from = log.account

    if (op.toString() == 'CREATE') {
      transfer = {
        op: 'CREATE',
        value: stack.peek(0).Bytes(),
        from: from,
        fromBalance: db.getBalance(from).Bytes(),
        to: big.CreateContractAddress(from, db.getNonce(from)),
        toBalance: db.getBalance(big.CreateContractAddress(from, db.getNonce(from))).Bytes(),
        input: memory.slice(big.ToInt(stack.peek(1)), big.ToInt(stack.peek(1)) + big.ToInt(stack.peek(2)))
      }
      this.transfers.push(transfer)
      return
    }

    if (op.toString() == 'CALL') {
      transfer = {
        op: 'CALL',
        value: stack.peek(2).Bytes(),
        from: from,
        fromBalance: db.getBalance(from).Bytes(),
        to: big.BigToAddress(stack.peek(1)),
        toBalance: db.getBalance(big.BigToAddress(stack.peek(1))).Bytes(),
        input: memory.slice(big.ToInt(stack.peek(3)), big.ToInt(stack.peek(3)) + big.ToInt(stack.peek(4)))
      }
      this.transfers.push(transfer)
      return
    }

    if (op.toString() == 'SELFDESTRUCT') {
      transfer = {
        op: 'SELFDESTRUCT',
        value: db.getBalance(from).Bytes(),
        from: from,
        fromBalance: db.getBalance(from).Bytes(),
        to: big.BigToAddress(stack.peek(0)),
        toBalance: db.getBalance(big.BigToAddress(stack.peek(0))).Bytes()
      }
      this.transfers.push(transfer)
      return
    }
  }
}
