import WebSocketClient from '../../helpers/ws-client'
import Configs from '../../configs'
import { getBlockAndProcess } from './process'

const ws = new WebSocketClient(Configs.ERC20_WS_CONNECTION, 5000)

ws.open()
ws.onmessage = data => {
  const messsage = JSON.parse(data)
  if (messsage.chain !== Configs.CHAIN) return
  getBlockAndProcess(messsage.number).then(console.log)
}
