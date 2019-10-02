import { CalculateReward, SetBlock, SetTxReceipt, SetUncles, SetMinerBalances, SetStateDiff, SetTraces, SetChainConfigs } from './processors/save-to-db'
import Configs from './configs'
import getWeb3 from './getWeb3'

const CHAIN = Configs.CHAIN

const processBlock = (blockNum, web3 = getWeb3(Configs.WS_HOST)) => {
  return new Promise(resolve => {
    const setBlock = new SetBlock(web3)
    const setTxReceipt = new SetTxReceipt(web3)
    const setUncles = new SetUncles(web3)
    const calculateReward = new CalculateReward(CHAIN)
    const setTraces = new SetTraces(web3)
    const setStateDiff = new SetStateDiff(web3)
    const setMinerBalances = new SetMinerBalances(web3)
    const setChainConfigs = new SetChainConfigs()
    setBlock
      .set(blockNum)
      .then(_block => setChainConfigs.set(_block))
      .then(_block => setTraces.set(_block))
      .then(_block => setTxReceipt.set(_block))
      .then(_block => setUncles.set(_block))
      .then(_block => calculateReward.set(_block))
      .then(_block => setMinerBalances.set(_block))
      .then(_block => setStateDiff.set(_block, true))
      .then(_block => {
        resolve(_block)
      })
      .catch(err => {
        console.error(err)
      })
  })
}

export default processBlock
