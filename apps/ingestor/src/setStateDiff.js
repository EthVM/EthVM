import {
  CalculateReward,
  SetBlock,
  SetTxReceipt,
  SetUncles,
  SetTraces,
  SetMinerBalances,
  SetStateDiff
} from './processors/save-to-db';
import Configs from './configs';
import getWeb3 from './getWeb3';
import processBlockOld from './processBlock';
const CHAIN = Configs.CHAIN;
const assert = b => {
  if (!b) throw new Error('Not valid');
};
const processBlock = (blockNum, web3 = getWeb3(Configs.WS_HOST)) => {
  return new Promise(resolve => {
    const setBlock = new SetBlock(web3);
    const setTxReceipt = new SetTxReceipt(web3);
    const setUncles = new SetUncles(web3);
    const calculateReward = new CalculateReward(CHAIN);
    const setTraces = new SetTraces(web3);
    const setStateDiff = new SetStateDiff(web3);
    const setMinerBalances = new SetMinerBalances(web3);
    setBlock
      .set(blockNum)
      .then(_block => setTraces.set(_block))
      .then(_block => setTxReceipt.set(_block))
      .then(_block => setUncles.set(_block))
      .then(_block => calculateReward.set(_block))
      .then(_block => setMinerBalances.set(_block))
      .then(_block => setStateDiff.set(_block, false))
      .then(_block => {
        // web3.currentProvider.disconnect();
        resolve(_block);
      });
  });
};
const BLOCK_NUM = 2376501;
const web3 = getWeb3(Configs.WS_HOST);
// const runner = blockNum => {
//   processBlock(blockNum, web3).then(block => {
//     console.log(block.number);
//     runner(blockNum + 1);
//   });
// };
const runner = blockNum => {
  console.log(blockNum);
  processBlock(blockNum, web3).then(blockNew => {
    processBlockOld(blockNum, web3).then(blockOld => {
      blockOld.transactions.forEach((oldTx, idx) => {
        const newTx = blockNew.transactions[idx];
        const newStateDiff = newTx.stateDiff;
        const oldStateDiff = oldTx.stateDiff;
        for (const address in oldStateDiff) {
          if (oldStateDiff[address].balance === '=') continue;
          if (
            oldStateDiff[address].balance['+'] &&
            oldStateDiff[address].balance['+'] === '0x0'
          )
            continue;
          if (
            oldStateDiff[address].balance['-'] &&
            oldStateDiff[address].balance['-'] === '0x0'
          )
            continue;
          console.log(oldTx.hash, newTx.hash);
          assert(oldTx.hash === newTx.hash);
          console.log(address);
          console.log(oldStateDiff[address].balance);
          console.log(newStateDiff[address].balance);
          if (oldStateDiff[address].balance['+']) {
            assert(newStateDiff[address].balance['*'].from === '0x0');
            assert(
              newStateDiff[address].balance['*'].to ===
                oldStateDiff[address].balance['+']
            );
          } else if (oldStateDiff[address].balance['-']) {
            assert(
              newStateDiff[address].balance['*'].from ===
                oldStateDiff[address].balance['-']
            );
            assert(newStateDiff[address].balance['*'].to === '0x0');
          } else {
            assert(
              newStateDiff[address].balance['*'].from ===
                oldStateDiff[address].balance['*'].from
            );
            assert(
              newStateDiff[address].balance['*'].to ===
                oldStateDiff[address].balance['*'].to
            );
          }
        }
      });
      runner(blockNum + 1);
    });
  });
};
runner(BLOCK_NUM);
