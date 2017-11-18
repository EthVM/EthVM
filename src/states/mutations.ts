import { stateLayout } from './state'

function incrementCount(state: stateLayout) {
	state.count++
}

export default {
	incrementCount
}