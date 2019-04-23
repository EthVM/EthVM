import { ConfigService } from '@app/shared/config.service'
import { Inject, Injectable } from '@nestjs/common'
import { PubSub } from 'graphql-subscriptions'
import createSubscriber from 'pg-listen'
import { Observable } from 'rxjs'
import { Logger } from 'winston'

interface CanonicalBlockHeaderPayload {
  hash: string
  number: string
}

interface TransactionPayload {
  hash: string
}

interface ContractPayload {
  address: string
}

type EventPayload = CanonicalBlockHeaderPayload | TransactionPayload | ContractPayload

interface Event {
  table: string
  action: string
  payload: EventPayload
}

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
    for (const key in toRemove) {
      delete countsBySecond[key]
    }

    return total / n
  }
}

@Injectable()
export class PgSubscriptionService {
  private readonly url: string

  constructor(@Inject('PUB_SUB') private readonly pubSub: PubSub, @Inject('winston') private readonly logger: Logger, private readonly config: ConfigService) {
    this.url = config.db.url

    this.init()
  }

  private async init() {
    const { url, logger } = this

    const events$ = Observable.create(async observer => {
      try {
        const subscriber = createSubscriber({ connectionString: url })

        subscriber.notifications.on('events', e => observer.next(e))
        subscriber.events.on('error', err => observer.error(err))

        await subscriber.connect()
        await subscriber.listenTo('events')

        return () => {
          subscriber.close()
        }
      } catch (err) {
        observer.error(err)
      }
    })

    const rateCalculator = new RateCalculator(30)

    events$.subscribe(event => {
      const eventRate = rateCalculator.update(new Date().getTime())

      if (eventRate < 200) {
        this.logger.info(`Event rate: ${eventRate}`)
        this.onEvent(event)
      }
    })
  }

  private async onEvent(event: Event) {
    this.logger.info('Event received', event)
  }
}
