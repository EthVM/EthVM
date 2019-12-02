import Configs from '../../configs'
import CliqueAuthor from '../../helpers/get-clique-author'
class SetChainConfigs {
  set(block) {
    return new Promise(resolve => {
      if (Configs.CHAIN === 'goerli') {
        block.miner = CliqueAuthor(block)
        resolve(block)
      } else {
        resolve(block)
      }
    })
  }
}

export default SetChainConfigs
