type itemProcessor<T> = (item: T, items: T[]) => T[]

export class FIFO<T> {
  private arr: T[]
  private limit: number
  private readonly processor: itemProcessor<T>

  constructor(_limit: number, _processor: itemProcessor<T>) {
    this.arr = []
    this.limit = _limit
    this.processor = _processor
  }

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

  public remove(index: number) {
    this.arr.splice(index, 1)
  }
}
