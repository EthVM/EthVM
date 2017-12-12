class FIFO<T>{
	private arr: Array<T>;
	private limit: number;
	private readonly type: string
	constructor(_limit: number) {
		this.arr = []
		this.limit = _limit
	}
	items(): Array<T> {
		return this.arr
	}
	add(item: T) {
		this.arr.unshift(item)
		if (this.arr.length > this.limit) this.arr = this.arr.slice(0, this.arr.length - 1)
	}
	top(): T {
		return this.arr[0]
	}
}
export default FIFO