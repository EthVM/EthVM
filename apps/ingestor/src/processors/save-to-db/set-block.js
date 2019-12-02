class SetBlock {
  constructor(web3) {
    this.web3 = web3
  }

  set(blockNumber) {
    return new Promise((resolve, reject) => {
      this.web3.eth
        .getBlock(blockNumber, true)
        .then(_block => {
          resolve(_block)
        })
        .catch(reject)
    })
  }
}

export default SetBlock
