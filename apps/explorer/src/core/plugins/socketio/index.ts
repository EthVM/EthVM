import Mixin from '@app/core/plugins/socketio/mixin'
import Listener from '@app/core/plugins/socketio/listener'
import Emitter from '@app/core/plugins/socketio/emitter'

import SocketIO from 'socket.io-client'
import _Vue from 'vue'

export class VueSocketIO {
  public io: SocketIOClient.Socket
  public emitter: Emitter
  public listener: Listener

  /**
   * lets take all resource
   * @param io
   * @param vuex
   */
  constructor({ connection, vuex }) {
    this.io = this.connect(connection)
    this.emitter = new Emitter(vuex)
    this.listener = new Listener(this.io, this.emitter)
  }

  /**
   * Vuejs entrypoint
   * @param Vue
   */
  install(Vue) {
    Vue.prototype.$socket = this.io
    Vue.prototype.$vueSocketIo = this
    Vue.mixin(Mixin)
  }

  /**
   * registering socketio instance
   * @param connection
   */
  connect(connection) {
    if (connection && typeof connection === 'object') {
      return connection
    } else if (typeof connection === 'string') {
      return (this.io = SocketIO(connection))
    } else {
      throw new Error('Unsupported connection type')
    }
  }
}

export function VueSocketIOPlugin(Vue: typeof _Vue, opts: any): void {
  const plugin = new VueSocketIO(opts)
  plugin.install(Vue)
}
