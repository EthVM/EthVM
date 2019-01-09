'use strict'

const NodeEnvironment = require('jest-environment-node')

class EthvmEnvironment extends NodeEnvironment {
  constructor(config) {
    super(Object.assign({}, config, {
      globals: Object.assign({}, config.globals, {
        Uint8Array: Uint8Array,
        ArrayBuffer: ArrayBuffer
      })
    }))
  }

  async setup() {
    await super.setup();
  }

  async teardown() {
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = EthvmEnvironment
