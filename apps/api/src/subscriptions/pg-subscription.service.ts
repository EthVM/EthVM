import { BlockService } from '@app/dao/block.service';
import { ConfigService } from '@app/shared/config.service';
import { Inject, Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import createSubscriber from 'pg-listen';
import { Observable, Subject } from 'rxjs';
import { bufferTime, filter } from 'rxjs/operators';
import { Logger } from 'winston';
import { CircuitBreaker, CircuitBreakerState } from './circuit-breaker';

export interface CanonicalBlockHeaderPayload {
  block_hash: string
  number: string
  transaction_count: number
  uncle_count: number
  author: string
}

export interface TransactionPayload {
  transaction_hash: string
  block_hash: string
}

export interface TransactionReceiptPayload {
  block_hash: string
  transaction_hash: string
}

export interface TransactionTracePayload {
  block_hash: string
  transaction_hash?: string
  trace_address: string
  type: string
  action?: string
  error?: string
}

export type PgEventPayload =
  CanonicalBlockHeaderPayload | TransactionPayload | TransactionReceiptPayload | TransactionTracePayload

export class PgEvent {

  public readonly table: string;
  public readonly action: string;
  public readonly payload: PgEventPayload;

  constructor(data: any) {
    this.table = data.table;
    this.action = data.action;
    this.payload = data.payload;
  }

}

function inputIsCircuitBreakerState(input: CircuitBreakerState): input is CircuitBreakerState {
  return input instanceof CircuitBreakerState
}

function isCircuitBreakerState<CircuitBreakerState>() {
  return (source$: Observable<any>) => source$.pipe(
    filter(inputIsCircuitBreakerState)
  )
}

function inputIsEvent(input: PgEvent): input is PgEvent {
  return input instanceof PgEvent
}


function isPgEvent<PgEvent>() {
  return (source$: Observable<any>) => source$.pipe(
    filter(inputIsEvent)
  )
}

class BlockEvents {

  header?: CanonicalBlockHeaderPayload
  rootCallTrace?: TransactionTracePayload

  transactions: Map<string, TransactionPayload> = new Map()
  receipts: Map<String, TransactionReceiptPayload> = new Map()

  blockRewardAuthor?: string
  uncleRewards: Map<string, TransactionTracePayload> = new Map()

  createdAt: Date = new Date()

  isComplete(): boolean {

    const { header, transactions, receipts, blockRewardAuthor, uncleRewards, rootCallTrace } = this

    if (header == undefined || rootCallTrace == undefined) return false

    const { transaction_count, uncle_count } = header

    // check transactions

    if (transactions.size != transaction_count) return false

    // check receipts

    if (receipts.size != transaction_count) return false

    // check rewards

    if (blockRewardAuthor != header.author) return false

    if (uncleRewards.size != uncle_count) return false

    // otherwise we have seen all the components that we need before we can send a notification
    return true
  }

}

@Injectable()
export class PgSubscriptionService {

  private readonly url: string
  private readonly maxRate = 2000

  private blockEvents: Map<string, BlockEvents> = new Map()

  constructor(
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
    @Inject('winston') private readonly logger: Logger,
    private readonly config: ConfigService,
    private readonly blockService: BlockService,
  ) {

    this.url = config.db.url

    this.init()
  }

  private init() {

    const { url, logger, blockService, pubSub } = this

    const events$ = Observable.create(async observer => {
      try {
        const subscriber = createSubscriber({ connectionString: url })

        subscriber.notifications.on('events', e => observer.next(e))
        subscriber.events.on('error', err => {
          console.error('pg sub error', err)
          observer.error(err)
        })

        await subscriber.connect()
        await subscriber.listenTo('events')

        return () => {
          subscriber.close()
        }
      } catch (err) {
        console.error('Pg sub error', err)
        observer.error(err)
      }
    })

    const circuitBreaker = new CircuitBreaker<PgEvent>(5, this.maxRate)

    const blockHashes$ = new Subject<string>()

    events$.subscribe(
      event => circuitBreaker.next(new PgEvent(event)),
      err => circuitBreaker.error(err)
    )

    circuitBreaker.subject
      .pipe(isCircuitBreakerState())
      .subscribe(event => {
        pubSub.publish('isSyncing', !!event.isOpen)
      })

    const pgEvents$ = circuitBreaker.subject
      .pipe(isPgEvent())

    //
    this.blockEvents = new Map()

    pgEvents$.subscribe(event => this.onEvent(event, blockHashes$))

    blockHashes$
      .pipe(
        bufferTime(100),
        filter(blockHashes => blockHashes.length > 0)
      )
      .subscribe(async blockHashes => {
        
        const blocks = await blockService.findBlocksByHashes(blockHashes)

        blocks.forEach(block => {

          pubSub.publish('block', block)

          if (block.txs) {
            block.txs!.forEach(tx => pubSub.publish('transaction', tx))
          }

          if (block.uncles) {
            block.uncles!.forEach(uncle => pubSub.publish('uncle', uncle))
          }

        })

      })

  }

  private onEvent(event: PgEvent, blockHashes$: Subject<string>) {

    const { blockEvents, pubSub, logger } = this;

    const { table, payload } = event
    const { block_hash } = payload

    let entry = blockEvents.get(block_hash)

    if (!entry) {
      entry = new BlockEvents()
      blockEvents.set(block_hash, entry)
    }

    switch (table) {

      case 'canonical_block_header':
        const header = payload as CanonicalBlockHeaderPayload
        entry.header = header
        break

      case 'transaction':
        const tx = payload as TransactionPayload
        entry.transactions.set(tx.transaction_hash, tx)
        break

      case 'transaction_receipt':
        const receipt = payload as TransactionReceiptPayload
        entry.receipts.set(receipt.transaction_hash, receipt)
        break

      case 'transaction_trace':
        const trace = payload as TransactionTracePayload

        switch (trace.type) {

          case 'call':
            entry.rootCallTrace = trace
            break

          case 'reward':

            const action = JSON.parse(trace.action || '{}')
            const rewardType = action.TraceRewardActionRecord.rewardType;

            switch (rewardType) {

              case 'block':
                entry.blockRewardAuthor = action.TraceRewardActionRecord.author
                break

              case 'uncle':
                entry.uncleRewards.set(action.author, trace)
                break

              default:
                throw new Error(`Unexpected reward type: ${rewardType}`)

            }
            break

          default:
            throw new Error(`Unexpected trace type: ${trace.type}`)
        }

        break;

      default:
        throw new Error(`Unexpected table name: ${table}`)

    }

    if (entry.isComplete()) {
      // remove from the map and emit an event
      console.log('Entry is complete', block_hash)
      blockHashes$.next(block_hash)
      blockEvents.delete(block_hash)
    }

  }


}
