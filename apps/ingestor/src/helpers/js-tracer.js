// const obj = {
//   callstack: [{}],
//   descended: false,
//   step: function(log, db) {
//     var error = log.getError()
//     if (error !== undefined) {
//       this.fault(log, db)
//       return
//     }
//     var syscall = (log.op.toNumber() & 0xf0) == 0xf0
//     if (syscall) {
//       var op = log.op.toString()
//     }
//     if (syscall && (op == 'CREATE' || op == 'CREATE2')) {
//       var inOff = log.stack.peek(1).valueOf()
//       var inEnd = inOff + log.stack.peek(2).valueOf()
//       var call = {
//         type: op,
//         from: toHex(log.contract.getAddress()),
//         input: toHex(log.memory.slice(inOff, inEnd)),
//         gasIn: log.getGas(),
//         gasCost: log.getCost(),
//         value: '0x' + log.stack.peek(0).toString(16)
//       }
//       this.callstack.push(call)
//       this.descended = true
//       return
//     }
//     if (syscall && op == 'SELFDESTRUCT') {
//       var left = this.callstack.length
//       if (this.callstack[left - 1].calls === undefined) {
//         this.callstack[left - 1].calls = []
//       }
//       this.callstack[left - 1].calls.push({
//         type: op,
//         from: toHex(log.contract.getAddress()),
//         to: '0x' + log.stack.peek(0).toString(16),
//         value: db.getBalance(log.contract.getAddress())
//       })
//       return
//     }
//     if (syscall && (op == 'CALL' || op == 'CALLCODE' || op == 'DELEGATECALL' || op == 'STATICCALL')) {
//       var to = toAddress(log.stack.peek(1).toString(16))
//       if (isPrecompiled(to)) {
//         return
//       }
//       var off = op == 'DELEGATECALL' || op == 'STATICCALL' ? 0 : 1
//       var inOff = log.stack.peek(2 + off).valueOf()
//       var inEnd = inOff + log.stack.peek(3 + off).valueOf()
//       var call = {
//         type: op,
//         from: toHex(log.contract.getAddress()),
//         to: toHex(to),
//         input: toHex(log.memory.slice(inOff, inEnd)),
//         gasIn: log.getGas(),
//         gasCost: log.getCost(),
//         outOff: log.stack.peek(4 + off).valueOf(),
//         outLen: log.stack.peek(5 + off).valueOf()
//       }
//       if (op != 'DELEGATECALL' && op != 'STATICCALL') {
//         call.value = '0x' + log.stack.peek(2).toString(16)
//       }
//       this.callstack.push(call)
//       this.descended = true
//       return
//     }
//     if (this.descended) {
//       if (log.getDepth() >= this.callstack.length) {
//         this.callstack[this.callstack.length - 1].gas = log.getGas()
//       } else {
//       }
//       this.descended = false
//     }
//     if (syscall && op == 'REVERT') {
//       this.callstack[this.callstack.length - 1].error = 'execution reverted'
//       return
//     }
//     if (log.getDepth() == this.callstack.length - 1) {
//       var call = this.callstack.pop()

//       if (call.type == 'CREATE' || call.type == 'CREATE2') {
//         call.gasUsed = '0x' + bigInt(call.gasIn - call.gasCost - log.getGas()).toString(16)
//         delete call.gasIn
//         delete call.gasCost
//         var ret = log.stack.peek(0)
//         if (!ret.equals(0)) {
//           call.to = toHex(toAddress(ret.toString(16)))
//           call.output = toHex(db.getCode(toAddress(ret.toString(16))))
//         } else if (call.error === undefined) {
//           call.error = 'internal failure'
//         }
//       } else {
//         if (call.gas !== undefined) {
//           call.gasUsed = '0x' + bigInt(call.gasIn - call.gasCost + call.gas - log.getGas()).toString(16)

//           var ret = log.stack.peek(0)
//           if (!ret.equals(0)) {
//             call.output = toHex(log.memory.slice(call.outOff, call.outOff + call.outLen))
//           } else if (call.error === undefined) {
//             call.error = 'internal failure'
//           }
//         }
//         delete call.gasIn
//         delete call.gasCost
//         delete call.outOff
//         delete call.outLen
//       }
//       if (call.gas !== undefined) {
//         call.gas = '0x' + bigInt(call.gas).toString(16)
//       }
//       var left = this.callstack.length
//       if (this.callstack[left - 1].calls === undefined) {
//         this.callstack[left - 1].calls = []
//       }
//       this.callstack[left - 1].calls.push(call)
//     }
//   },
//   fault: function(log, db) {
//     if (this.callstack[this.callstack.length - 1].error !== undefined) {
//       return
//     }
//     var call = this.callstack.pop()
//     call.error = log.getError()
//     if (call.gas !== undefined) {
//       call.gas = '0x' + bigInt(call.gas).toString(16)
//       call.gasUsed = call.gas
//     }
//     delete call.gasIn
//     delete call.gasCost
//     delete call.outOff
//     delete call.outLen
//     var left = this.callstack.length
//     if (left > 0) {
//       if (this.callstack[left - 1].calls === undefined) {
//         this.callstack[left - 1].calls = []
//       }
//       this.callstack[left - 1].calls.push(call)
//       return
//     }
//     this.callstack.push(call)
//   },
//   result: function(ctx, db) {
//     var result = {
//       type: ctx.type,
//       from: toHex(ctx.from),
//       to: toHex(ctx.to),
//       value: '0x' + ctx.value.toString(16),
//       gas: '0x' + bigInt(ctx.gas).toString(16),
//       gasUsed: '0x' + bigInt(ctx.gasUsed).toString(16),
//       input: toHex(ctx.input),
//       output: toHex(ctx.output),
//       time: ctx.time
//     }
//     if (this.callstack[0].calls !== undefined) {
//       result.calls = this.callstack[0].calls
//     }
//     if (this.callstack[0].error !== undefined) {
//       result.error = this.callstack[0].error
//     } else if (ctx.error !== undefined) {
//       result.error = ctx.error
//     }
//     if (result.error !== undefined) {
//       delete result.output
//     }
//     return this.finalize(result)
//   },
//   finalize: function(call) {
//     var sorted = {
//       type: call.type,
//       from: call.from,
//       to: call.to,
//       value: call.value,
//       gas: call.gas,
//       gasUsed: call.gasUsed,
//       input: call.input,
//       output: call.output,
//       error: call.error,
//       time: call.time,
//       calls: call.calls
//     }
//     for (var key in sorted) {
//       if (sorted[key] === undefined) {
//         delete sorted[key]
//       }
//     }
//     if (sorted.calls !== undefined) {
//       for (var i = 0; i < sorted.calls.length; i++) {
//         sorted.calls[i] = this.finalize(sorted.calls[i])
//       }
//     }
//     return sorted
//   }
// }
export default '{callstack:[{}],descended:!1,step:function(t,e){if(void 0===t.getError()){var s=240==(240&t.op.toNumber());if(s)var a=t.op.toString();if(s&&("CREATE"==a||"CREATE2"==a)){var l=(c=t.stack.peek(1).valueOf())+t.stack.peek(2).valueOf(),o={type:a,from:toHex(t.contract.getAddress()),input:toHex(t.memory.slice(c,l)),gasIn:t.getGas(),gasCost:t.getCost(),value:"0x"+t.stack.peek(0).toString(16)};return this.callstack.push(o),void(this.descended=!0)}if(s&&"SELFDESTRUCT"==a){var r=this.callstack.length;return void 0===this.callstack[r-1].calls&&(this.callstack[r-1].calls=[]),void this.callstack[r-1].calls.push({type:a,from:toHex(t.contract.getAddress()),to:"0x"+t.stack.peek(0).toString(16),value:e.getBalance(t.contract.getAddress())})}if(s&&("CALL"==a||"CALLCODE"==a||"DELEGATECALL"==a||"STATICCALL"==a)){var i=toAddress(t.stack.peek(1).toString(16));if(isPrecompiled(i))return;var c,g="DELEGATECALL"==a||"STATICCALL"==a?0:1;l=(c=t.stack.peek(2+g).valueOf())+t.stack.peek(3+g).valueOf(),o={type:a,from:toHex(t.contract.getAddress()),to:toHex(i),input:toHex(t.memory.slice(c,l)),gasIn:t.getGas(),gasCost:t.getCost(),outOff:t.stack.peek(4+g).valueOf(),outLen:t.stack.peek(5+g).valueOf()};return"DELEGATECALL"!=a&&"STATICCALL"!=a&&(o.value="0x"+t.stack.peek(2).toString(16)),this.callstack.push(o),void(this.descended=!0)}if(this.descended&&(t.getDepth()>=this.callstack.length&&(this.callstack[this.callstack.length-1].gas=t.getGas()),this.descended=!1),s&&"REVERT"==a)this.callstack[this.callstack.length-1].error="execution reverted";else if(t.getDepth()==this.callstack.length-1){if("CREATE"==(o=this.callstack.pop()).type||"CREATE2"==o.type){o.gasUsed="0x"+bigInt(o.gasIn-o.gasCost-t.getGas()).toString(16),delete o.gasIn,delete o.gasCost,(n=t.stack.peek(0)).equals(0)?void 0===o.error&&(o.error="internal failure"):(o.to=toHex(toAddress(n.toString(16))),o.output=toHex(e.getCode(toAddress(n.toString(16)))))}else{var n;if(void 0!==o.gas)o.gasUsed="0x"+bigInt(o.gasIn-o.gasCost+o.gas-t.getGas()).toString(16),(n=t.stack.peek(0)).equals(0)?void 0===o.error&&(o.error="internal failure"):o.output=toHex(t.memory.slice(o.outOff,o.outOff+o.outLen));delete o.gasIn,delete o.gasCost,delete o.outOff,delete o.outLen}void 0!==o.gas&&(o.gas="0x"+bigInt(o.gas).toString(16));r=this.callstack.length;void 0===this.callstack[r-1].calls&&(this.callstack[r-1].calls=[]),this.callstack[r-1].calls.push(o)}}else this.fault(t,e)},fault:function(t,e){if(void 0===this.callstack[this.callstack.length-1].error){var s=this.callstack.pop();s.error=t.getError(),void 0!==s.gas&&(s.gas="0x"+bigInt(s.gas).toString(16),s.gasUsed=s.gas),delete s.gasIn,delete s.gasCost,delete s.outOff,delete s.outLen;var a=this.callstack.length;if(a>0)return void 0===this.callstack[a-1].calls&&(this.callstack[a-1].calls=[]),void this.callstack[a-1].calls.push(s);this.callstack.push(s)}},result:function(t,e){var s={type:t.type,from:toHex(t.from),to:toHex(t.to),value:"0x"+t.value.toString(16),gas:"0x"+bigInt(t.gas).toString(16),gasUsed:"0x"+bigInt(t.gasUsed).toString(16),input:toHex(t.input),output:toHex(t.output),time:t.time};return void 0!==this.callstack[0].calls&&(s.calls=this.callstack[0].calls),void 0!==this.callstack[0].error?s.error=this.callstack[0].error:void 0!==t.error&&(s.error=t.error),void 0!==s.error&&delete s.output,this.finalize(s)},finalize:function(t){var e={type:t.type,from:t.from,to:t.to,value:t.value,gas:t.gas,gasUsed:t.gasUsed,input:t.input,output:t.output,error:t.error,time:t.time,calls:t.calls};for(var s in e)void 0===e[s]&&delete e[s];if(void 0!==e.calls)for(var a=0;a<e.calls.length;a++)e.calls[a]=this.finalize(e.calls[a]);return e}}'
