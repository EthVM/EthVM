class SetUncles {
  constructor(web3) {
    this.web3 = web3;
  }

  set(block) {
    return new Promise(resolve => {
      if (block.uncles.length === 0) resolve(block);
      else {
        const promises = [];
        for (const i in block.uncles) {
          promises.push(this.web3.eth.getUncle(block.hash, i));
        }
        Promise.all(promises).then(uncles => {
          uncles.forEach((_uncle, idx) => {
            block.uncles[idx] = _uncle;
          });
          resolve(block);
        });
      }
    });
  }
}
export default SetUncles;
