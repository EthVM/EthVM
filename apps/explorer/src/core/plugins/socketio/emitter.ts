export default class EventEmitter {
  private store: any
  private actionPrefix: string
  private mutationPrefix: string
  private listeners: Map<any, any>

  constructor(vuex: any = {}) {
    this.store = vuex.store
    this.actionPrefix = vuex.actionPrefix ? vuex.actionPrefix : 'SOCKET_'
    this.mutationPrefix = vuex.mutationPrefix
    this.listeners = new Map()
  }

  /**
   * register new event listener with vuejs component instance
   * @param event
   * @param callback
   * @param component
   */
  addListener(event, callback, component) {
    if (typeof callback === 'function') {
      if (!this.listeners.has(event)) {
        this.listeners.set(event, [])
      }
      this.listeners.get(event).push({ callback, component })
    } else {
      throw new Error(`callback must be a function`)
    }
  }

  /**
   * remove a listenler
   * @param event
   * @param component
   */
  removeListener(event, component) {
    if (this.listeners.has(event)) {
      const listeners = this.listeners.get(event).filter(listener => listener.component !== component)

      if (listeners.length > 0) {
        this.listeners.set(event, listeners)
      } else {
        this.listeners.delete(event)
      }
    }
  }

  /**
   * broadcast incoming event to components
   * @param event
   * @param args
   */
  emit(event, args) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(listener => {
        listener.callback.call(listener.component, args)
      })
    }

    this.dispatchStore(event, args)
  }

  /**
   * dispatching vuex actions
   * @param event
   * @param args
   */
  dispatchStore(event, args) {
    if (this.store && this.store._actions) {
      for (const key in this.store._actions) {
        const action = key.split('/').pop()

        if (action === this.actionPrefix + event) {
          this.store.dispatch(key, args)
        }
      }

      if (this.mutationPrefix) {
        for (const key in this.store._mutations) {
          const mutation = key.split('/').pop()

          if (mutation === this.mutationPrefix + event) {
            this.store.commit(key, args)
          }
        }
      }
    }
  }
}
