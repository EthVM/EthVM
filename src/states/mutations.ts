import { stateLayout } from './state'

let incrementCount = (state: stateLayout) => {
	state.count++
}

export default {
	incrementCount
}