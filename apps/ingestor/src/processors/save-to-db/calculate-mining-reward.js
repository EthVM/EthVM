import { utils } from 'web3';
import ethjsCommon from 'ethereumjs-common';
import BN from 'bn.js';
const FRONTIER_BLOCK_REWARD = utils.toBN(utils.toWei('5', 'ether'));
const BYZANTIUM_BLOCK_REWARD = utils.toBN(utils.toWei('3', 'ether'));
const CONSTANTINOPLE_BLOCK_REWARD = utils.toBN(utils.toWei('2', 'ether'));

// https://github.com/ethereumjs/ethereumjs-vm/blob/0ccb64fff3e3fd0273e438a85b778631b26fe501/lib/runBlock.ts

const calculateOmmerReward = (ommerBlockNumber, blockNumber, minerReward) => {
  const heightDiff = blockNumber.sub(ommerBlockNumber);
  let reward = new BN(8).sub(heightDiff).mul(minerReward.divn(8));
  if (reward.ltn(0)) {
    reward = new BN(0);
  }
  return reward;
};
const calculateMinerReward = (minerReward, ommersNum) => {
  const niblingReward = minerReward.divn(32);
  const totalNiblingReward = niblingReward.muln(ommersNum);
  return totalNiblingReward;
};
const getTxFees = block => {
  let txfees = new BN(0);
  block.transactions.forEach(tx => {
    txfees = txfees.add(utils.toBN(tx.gasUsed).mul(utils.toBN(tx.gasPrice)));
  });
  return txfees;
};
const consensus = {
  mainnet: block => {
    const mainnet = new ethjsCommon('mainnet');
    const blockNumberBN = utils.toBN(block.number);
    let reward = FRONTIER_BLOCK_REWARD;
    if (blockNumberBN.eq(utils.toBN(0))) reward = utils.toBN(0);
    if (blockNumberBN.gte(utils.toBN(mainnet.hardforkBlock('byzantium'))))
      reward = BYZANTIUM_BLOCK_REWARD;
    if (blockNumberBN.gte(utils.toBN(mainnet.hardforkBlock('constantinople'))))
      reward = CONSTANTINOPLE_BLOCK_REWARD;
    block.uncles.forEach(ommer => {
      ommer.reward = utils.toHex(
        calculateOmmerReward(utils.toBN(ommer.number), blockNumberBN, reward)
      );
    });
    const uncles = calculateMinerReward(reward, block.uncles.length);
    const txFees = getTxFees(block);
    block.rewards = {
      base: utils.toHex(reward),
      uncles: utils.toHex(uncles),
      txFees: utils.toHex(txFees),
      total: utils.toHex(reward.add(uncles).add(txFees))
    };
  },
  ropsten: block => {
    const mainnet = new ethjsCommon('ropsten');
    const blockNumberBN = utils.toBN(block.number);
    let reward = FRONTIER_BLOCK_REWARD;
    if (blockNumberBN.eq(utils.toBN(0))) reward = utils.toBN(0);
    if (blockNumberBN.gte(utils.toBN(mainnet.hardforkBlock('byzantium'))))
      reward = BYZANTIUM_BLOCK_REWARD;
    if (blockNumberBN.gte(utils.toBN(mainnet.hardforkBlock('constantinople'))))
      reward = CONSTANTINOPLE_BLOCK_REWARD;
    block.uncles.forEach(ommer => {
      ommer.reward = utils.toHex(
        calculateOmmerReward(utils.toBN(ommer.number), blockNumberBN, reward)
      );
    });
    const uncles = calculateMinerReward(reward, block.uncles.length);
    const txFees = getTxFees(block);
    block.rewards = {
      base: utils.toHex(reward),
      uncles: utils.toHex(uncles),
      txFees: utils.toHex(txFees),
      total: utils.toHex(reward.add(uncles).add(txFees))
    };
  },
  kovan: block => {
    const reward = FRONTIER_BLOCK_REWARD;
    const txFees = getTxFees(block);
    block.rewards = {
      base: utils.toHex(reward),
      uncles: '0x0',
      txFees: utils.toHex(txFees),
      total: utils.toHex(reward.add(txFees))
    };
  }
};

class CalculateReward {
  constructor(chain) {
    this.chain = chain;
  }

  set(block) {
    consensus[this.chain](block);
    return Promise.resolve(block);
  }

  setSync(block) {
    consensus[this.chain](block);
    return block;
  }
}
export default CalculateReward;
