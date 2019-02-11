import { ItemProcessor } from '@app/core/store/processors'

export class FIFO<T> {
  private arr: T[] = []

  constructor(private readonly limit: number, private readonly processor: ItemProcessor<T>) {}

  public items(): T[] {
    return this.arr
  }

  public add(item: T) {
    this.arr = this.processor(item, this.arr)
    if (this.arr.length > this.limit) {
      this.arr = this.arr.slice(0, this.arr.length - 1)
    }
  }

  public top(): T {
    return this.arr[0]
  }

  public end(): T {
    const last = this.arr.length > 0 ? this.arr.length - 1 : 0
    return this.arr[last]
  }

  public remove(index: number) {
    this.arr.splice(index, 1)
  }
}
