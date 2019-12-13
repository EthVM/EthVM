import Configs from '../../configs'
import getWeb3 from '../../getWeb3'
import SetERC20Info from './set-erc20-info'
import SetERC721Info from './set-erc721-info'
import SetEthInfo from './set-eth-info'
import { S3DB } from '../../datastore'

const TOKEN_KEY_PREFIX = Configs.TOKEN_KEY_PREFIX

const db = new S3DB(Configs.S3_BUCKET)
const setEthInfo = new SetEthInfo()
const setERC721Info = new SetERC721Info()

const processBlock = (_block, web3) => {
  const setERC20Info = new SetERC20Info(web3)
  return new Promise(resolve => {
    const result = {
      ERC20: [],
      ERC721: [],
      ETH: []
    }
    setERC20Info.process(_block).then(erc20transfers => {
      result.ERC20 = erc20transfers
      setEthInfo.process(_block).then(ethTransfers => {
        result.ETH = ethTransfers
        setERC721Info.process(_block).then(erc721Transfers => {
          result.ERC721 = erc721Transfers
          db.put(TOKEN_KEY_PREFIX + _block.number, result).then(() => {
            resolve(_block.number)
          })
        })
      })
    })
  })
}
const getBlockAndProcess = (blockNum, web3) => {
  return db.get(blockNum).then(_block => {
    return processBlock(_block, web3)
  })
}
export { getBlockAndProcess, processBlock }
