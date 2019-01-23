import { ListenerFn } from 'eventemitter3'

export type StreamingEventName = 'block' | 'pendingTx' | 'blockStat'

export interface StreamingEvent {
  op: 'insert' | 'delete' | 'replace' | 'updated' | 'invalidate'
  key: any
  value: any
}

export interface Streamer {
  initialize(): Promise<boolean>

  addListener(eventName: StreamingEventName, fn: ListenerFn)
  removeListener(eventName: StreamingEventName, fn?: ListenerFn)
}
