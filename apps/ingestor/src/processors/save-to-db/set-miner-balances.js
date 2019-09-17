import { utils } from 'web3';
import { getEthBalance } from '../../helpers';
class SetMinerBalances {
  constructor(web3) {
    this.web3 = web3;
  }

  set(block) {
    return new Promise(resolve => {
      const promises = [];
      const previousBlock = block.number - 1;
      for (const i in block.uncles) {
        promises.push(
          getEthBalance(block.uncles[i].miner, block.number, this.web3)
        );
        promises.push(
          getEthBalance(block.uncles[i].miner, previousBlock, this.web3)
        );
      }
      promises.push(getEthBalance(block.miner, block.number, this.web3));
      promises.push(getEthBalance(block.miner, previousBlock, this.web3));
      Promise.all(promises).then(balances => {
        for (const i in block.uncles) {
          block.uncles[i].minerBalance = {
            to: utils.toHex(balances.shift()),
            from: utils.toHex(balances.shift())
          };
        }
        block.minerBalance = {
          to: utils.toHex(balances.shift()),
          from: utils.toHex(balances.shift())
        };
        resolve(block);
      });
    });
  }
}
export default SetMinerBalances;
