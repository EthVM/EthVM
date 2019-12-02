import Configs from '../configs'
import { utils } from 'web3'

const getGenesisState = () => {
  return require('ethereumjs-common/dist/genesisStates').genesisStateByName(Configs.CHAIN)
}

const getEthBalance = (address, blockNum, web3) => {
  if (utils.toBN(blockNum).lt(utils.toBN(0))) {
    const genesis = getGenesisState()
    if (genesis[address.toLowerCase()]) return Promise.resolve(utils.toBN(genesis[address.toLowerCase()]).toString())
    else return Promise.resolve(0)
  } else {
    return web3.eth.getBalance(address, blockNum)
  }
}

const getBatchEthBalance = (addresses, blockNum, web3) => {
  return new Promise((resolve, reject) => {
    if (utils.toBN(blockNum).lt(utils.toBN(0))) {
      const genesis = getGenesisState()
      const resultArr = []
      addresses.forEach(address => {
        if (genesis[address.toLowerCase()]) resultArr.push(utils.toBN(genesis[address.toLowerCase()]).toString())
        else resultArr.push(0)
      })
      return resolve(resultArr)
    } else {
      const batch = new web3.BatchRequest()
      let numCompleted = 0
      const resultArr = []
      addresses.forEach((address, idx) => {
        batch.add(
          web3.eth.getBalance.request(address, blockNum, (err, result) => {
            if (err) return reject(err)
            else {
              numCompleted++
              resultArr[idx] = result
              if (numCompleted === addresses.length) {
                return resolve(resultArr)
              }
            }
          })
        )
      })
      batch.execute()
    }
  })
}

export { getGenesisState, getEthBalance, getBatchEthBalance }
