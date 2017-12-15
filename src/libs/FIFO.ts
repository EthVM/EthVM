type itemProcessor<T> = (item: T, items: Array<T>) => Array<T>;
class FIFO<T>{
	private arr: Array<T>;
	private limit: number;
	private readonly processor: itemProcessor<T>
	constructor(_limit: number, _processor: itemProcessor<T>) {
		this.arr = []
		this.limit = _limit
		this.processor = _processor
	}
	items(): Array<T> {
		return this.arr
	}
	add(item: T) {
		this.arr = this.processor(item, this.arr)
		if (this.arr.length > this.limit) this.arr = this.arr.slice(0, this.arr.length - 1)
	}
	top(): T {
		return this.arr[0]
	}
	remove(index: number) {
		this.arr.splice(index,1)
	}
}
export default FIFO