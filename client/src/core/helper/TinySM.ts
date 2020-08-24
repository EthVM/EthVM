export interface State {
    name: string
    enter: () => void
    exit?: () => void
}

export class TinySM {
    private states: State[]
    private currentState: State | null = null

    constructor(_states: State[]) {
        if (_states.length === 0) {
            throw new Error('No enough states defined!')
        }
        this.states = _states
    }

    public transition(name: string) {
        // Exit old state
        if (this.currentState && this.currentState.exit) {
            this.currentState.exit.call(this)
        }

        // Change to the new state
        this.currentState = this.states.filter(s => s.name === name)[0]

        // Enter the new state
        if (this.currentState && this.currentState.enter) {
            this.currentState.enter.call(this)
        }
    }
}
