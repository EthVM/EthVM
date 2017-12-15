interface transfer {
	op: string;
	value: string;
	from: string;
	fromBalance: string;
	to: string;
	toBalance: string;
	input: string;
}
export default interface traceLayout {
	isError: boolean;
	msg: string;
	transfers: Array<transfer>
}