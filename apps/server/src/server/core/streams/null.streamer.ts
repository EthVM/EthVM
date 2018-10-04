import { Streamer } from '@app/server/core/streams'
import { ListenerFn } from 'eventemitter3'

export class NullStreamer implements Streamer {
  public initialize(): Promise<boolean> {
    return Promise.resolve(true)
  }

  public addListener(eventName: string, fn: ListenerFn) {
    // No implementation
  }

  public removeListener(eventName: string, fn?: ListenerFn) {
    // No implementation
  }

  public onNewBlock(block: any) {
    // No implementation
  }

  public onNewTx(tx: any) {
    // No implementation
  }

  public onNewPendingTx(tx: any) {
    // No implementation
  }
}
