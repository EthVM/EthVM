import { stateLayout } from './state'

let all = (state: stateLayout): stateLayout => {
	return state
}

let getCount = (state: stateLayout): number => {
	return state.count
}

export default {
	all,
	getCount
}