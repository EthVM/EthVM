import { ConfigService } from '@app/shared/config.service';
import { Inject, Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import createSubscriber from 'pg-listen';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Logger } from 'winston';
import { CircuitBreaker, CircuitBreakerState } from './circuit-breaker';

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

function isCircuitBreakerState<CircuitBreakerState>() {
  return (source$: Observable<any>) => source$.pipe(
    filter(event => event instanceof CircuitBreakerState),
    map(event => event as CircuitBreakerState)
  )
}

@Injectable()
export class PgSubscriptionService {

  private readonly url: string
  private readonly maxRate = 1000

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

    const circuitBreaker = new CircuitBreaker<Event>(10, this.maxRate)

    events$.subscribe(circuitBreaker.next, circuitBreaker.error)

    circuitBreaker.subject
      .pipe(isCircuitBreakerState())
      .subscribe(event => this.logger.info('Circuit breaker state change', event))

  }

}
