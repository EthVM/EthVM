import WebSocket from 'ws'

class WebSocketClient {
  constructor(url, retryInterval) {
    this.number = 0
    this.url = url
    this.autoReconnectInterval = retryInterval
  }

  open(url) {
    this.instance = new WebSocket(this.url)
    this.instance.on('open', () => {
      this.onopen()
    })
    this.instance.on('message', (data, flags) => {
      this.number++
      this.onmessage(data, flags, this.number)
    })
    this.instance.on('close', e => {
      switch (e.code) {
        case 1000:
          break
        default:
          this.reconnect(e)
          break
      }
      this.onclose(e)
    })
    this.instance.on('error', e => {
      switch (e.code) {
        case 'ECONNREFUSED':
          this.reconnect(e)
          break
        default:
          this.onerror(e)
          break
      }
    })
  }

  send(data, option) {
    try {
      this.instance.send(data, option)
    } catch (e) {
      this.instance.emit('error', e)
    }
  }

  reconnect(e) {
    console.log(`WebSocketClient: retry in ${this.autoReconnectInterval}ms`, e)
    this.instance.removeAllListeners()
    var that = this
    setTimeout(function() {
      console.log('WebSocketClient: reconnecting...')
      that.open(that.url)
    }, this.autoReconnectInterval)
  }

  onopen(e) {
    console.log('WebSocketClient: open', arguments)
  }

  onmessage(data, flags, number) {
    console.log('WebSocketClient: message', arguments)
  }

  onerror(e) {
    console.log('WebSocketClient: error', arguments)
  }

  onclose(e) {
    console.log('WebSocketClient: closed', arguments)
  }
}

export default WebSocketClient
