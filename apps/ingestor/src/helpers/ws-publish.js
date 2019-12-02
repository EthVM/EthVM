import WebSocket from 'ws'
import Configs from '../configs'

class WS {
  constructor() {
    this.wss = new WebSocket.Server({ port: Configs.WS_PUBLISH_PORT })
  }

  publish(blockNumber) {
    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            chain: Configs.CHAIN,
            number: blockNumber
          })
        )
      }
    })
  }
}
export default WS
