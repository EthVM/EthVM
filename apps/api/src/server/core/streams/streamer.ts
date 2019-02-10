import { ListenerFn } from 'eventemitter3'

export interface StreamingEvent {
  op: 'insert' | 'delete' | 'replace' | 'updated' | 'invalidate'
  key: any
  value: any
}

export interface Streamer {
  initialize(): Promise<boolean>
  addListener(eventName: string, fn: ListenerFn)
  removeListener(eventName: string, fn?: ListenerFn)
}
