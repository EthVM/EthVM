import WebSocketClient from '../../helpers/ws-client'
import Configs from '../../configs'
import getWeb3 from '../../getWeb3'
import SetERC20Info from './set-erc20-info'
import SetEthInfo from './set-eth-info'
import { S3DB } from '../../datastore'

const ERC_20_KEY_PREFIX = 'ERC20/'

const ws = new WebSocketClient(Configs.ERC20_WS_CONNECTION, 5000)
const web3 = getWeb3(Configs.WS_HOST)
const setERC20Info = new SetERC20Info(web3)
const setEthInfo = new SetEthInfo()
const db = new S3DB(Configs.S3_BUCKET)
ws.open()
ws.onmessage = data => {
  const messsage = JSON.parse(data)
  if (messsage.chain !== Configs.CHAIN) return
  runner(messsage.number)
}
const runner = blockNum => {
  const time = new Date().getTime()
  db.get(blockNum).then(_block => {
    setERC20Info.process(_block).then(erc20transfers => {
      setEthInfo.process(_block).then(ethTransfers => {
        const allTransfers = erc20transfers.concat(ethTransfers)
        db.put(ERC_20_KEY_PREFIX + _block.number, allTransfers).then(() => {
          console.log('added block ' + _block.number, new Date().getTime() - time)
        })
      })
    })
  })
}
