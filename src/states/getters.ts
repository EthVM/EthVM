import { stateLayout } from './state'

function all(state: stateLayout): stateLayout {
	return state
}

function getCount(state: stateLayout): number {
	return state.count
}

export default {
	all: all,
	getCount: getCount
}