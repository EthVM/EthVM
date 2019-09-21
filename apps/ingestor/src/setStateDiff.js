import Configs from './configs'
import getWeb3 from './getWeb3'
import getAuthor from './helpers/get-clique-author'
import processBlock from './processBlock'

// const CHAIN = Configs.CHAIN

// const assert = b => {
//   if (!b) throw new Error('Not valid')
// }

const BLOCK_NUM = 478396

const web3 = getWeb3(Configs.WS_HOST)
// web3.eth.getBlock(BLOCK_NUM).then(block => {
//   console.log(getAuthor(block))
// })
// const runner = blockNum => {
//   processBlock(blockNum, web3).then(block => {
//     console.log(block.number);
//     runner(blockNum + 1);
//   });
// };

const runner = blockNum => {
  console.log(blockNum)
  processBlock(blockNum, web3).then(blockNew => {})
}
runner(BLOCK_NUM)
