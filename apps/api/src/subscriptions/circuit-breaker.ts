import { Subject } from "rxjs";

class RateCalculator {

    private countsBySecond: number[]

    constructor(private readonly windowSeconds: number) {
        this.countsBySecond = []
    }

    update(timestamp: number) {
        const { countsBySecond, windowSeconds } = this

        // add new entry

        const timestampSecond = Math.floor(timestamp / 1000)
        countsBySecond[timestampSecond] = (countsBySecond[timestampSecond] || 0) + 1

        const minTimestampSecond = timestampSecond - windowSeconds
        const toRemove: number[] = []

        let total = 0
        let n = 0

        // iterate over the sparse array

        for (const key in countsBySecond) {

            const keyNumber = +key

            // record any entries which are outside the time window and need removed
            if (keyNumber < minTimestampSecond) {
                toRemove.push(keyNumber)
            } else {
                total += countsBySecond[key]
                n += 1
            }
        }

        // remove older entries
        for (const key of toRemove) {
            delete countsBySecond[key]
        }

        return total / n
    }
}

export class CircuitBreakerState {
    constructor(public readonly isOpen: boolean) { }
}

export class CircuitBreaker<T> {

    public readonly subject: Subject<CircuitBreakerState | T>;

    private readonly rateCalculator: RateCalculator
    private isOpen: boolean

    constructor(
        private readonly windowSeconds: number,
        private readonly maxRate: number
    ) {

        this.rateCalculator = new RateCalculator(windowSeconds)
        this.subject = new Subject()
        this.isOpen = true

    }

    determineState(timestamp: number) {

        const { isOpen, rateCalculator, maxRate } = this;

        const eventRate = rateCalculator.update(timestamp)

        if (isOpen && eventRate > maxRate) {
            this.isOpen = false
            this.onClose()
        } else if (!isOpen && eventRate <= maxRate) {
            this.isOpen = true
            this.onOpen()
        }

        return this.isOpen
    }

    onOpen() {
        this.subject.next(new CircuitBreakerState(true))
    }

    onClose() {
        this.subject.next(new CircuitBreakerState(false))
    }

    next(event: T) {

        const timestamp = new Date().getTime()
        const isOpen = this.determineState(timestamp)

        if (this.isOpen) {
            this.subject.next(event)
        }

    }

    error(err: Error) {
        console.error('Circuit breaker received error', err)
        this.subject.error(err)
    }

}