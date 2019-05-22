import { BlockService } from '@app/dao/block.service'
import { ConfigService } from '@app/shared/config.service'
import { Inject, Injectable } from '@nestjs/common'
import { PubSub } from 'graphql-subscriptions'
import createSubscriber from 'pg-listen'
import { Observable, Subject } from 'rxjs'
import { bufferTime, filter } from 'rxjs/operators'
import { Logger } from 'winston'
import { CircuitBreaker, CircuitBreakerState } from './circuit-breaker'
import { TxService } from '@app/dao/tx.service'
import { BlockMetricsService } from '@app/dao/block-metrics.service'

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
  root_error: string
}

export interface BlockMetricPayload {
  block_hash: string
  timestamp: number
}

export type PgEventPayload =
  CanonicalBlockHeaderPayload
  | TransactionPayload
  | TransactionReceiptPayload
  | TransactionTracePayload
  | BlockMetricPayload

export class PgEvent {

  public readonly table: string
  public readonly action: string
  public readonly payload: PgEventPayload

  constructor(data: any) {
    this.table = data.table
    this.action = data.action
    this.payload = data.payload
  }

}

function inputIsCircuitBreakerState(input: any): input is CircuitBreakerState {
  return input instanceof CircuitBreakerState
}

// tslint:disable-next-line:no-shadowed-variable
function isCircuitBreakerState<CircuitBreakerState>() {
  return (source$: Observable<any>) => source$.pipe(
    filter(inputIsCircuitBreakerState),
  )
}

function inputIsEvent(input: any): input is PgEvent {
  return input instanceof PgEvent
}

// tslint:disable-next-line:no-shadowed-variable
function isPgEvent<PgEvent>() {
  return (source$: Observable<any>) => source$.pipe(
    filter(inputIsEvent),
  )
}

// tslint:disable-next-line:no-shadowed-variable
function isBlockEvent<PgEvent>() {

  const tables = new Set<string>([
    'canonical_block_header',
    'transaction',
    'transaction_trace',
    'transaction_receipt',
  ])

  return (source$: Observable<any>) => source$.pipe(
    filter(inputIsEvent),
    filter(e => tables.has(e.table)),
  )
}

// tslint:disable-next-line:no-shadowed-variable
function isBlockMetricEvent<PgEvent>() {

  const tables = new Set<string>([
    'block_metrics_header',
    'block_metrics_transaction',
    'block_metrics_transaction_trace',
    'block_metrics_transaction_fee',
  ])

  return (source$: Observable<any>) => source$.pipe(
    filter(inputIsEvent),
    filter(e => tables.has(e.table)),
  )

}

class BlockMetricEvents {

  header = false
  transaction = false
  trace = false
  fee = false

  get isComplete(): boolean {
    return this.header && this.transaction && this.trace && this.fee
  }

}

class BlockEvents {

  header?: CanonicalBlockHeaderPayload

  rewardsTrace?: TransactionTracePayload
  txTrace?: TransactionTracePayload

  transactions: Map<string, TransactionPayload> = new Map()
  receipts: Map<string, TransactionReceiptPayload> = new Map()

  createdAt: Date = new Date()

  constructor(private readonly instaMining: boolean) {
  }

  get isComplete(): boolean {

    const { header, transactions, receipts, rewardsTrace, txTrace, instaMining } = this

    if (header === undefined || rewardsTrace || txTrace === undefined) return false

    const { transaction_count } = header

    // check transactions

    if (transactions.size !== transaction_count) return false

    // check receipts

    if (receipts.size !== transaction_count) return false

    // check rewards

    if (!instaMining && rewardsTrace == null) return false

    // otherwise we have seen all the components that we need before we can send a notification
    return true
  }

}

@Injectable()
export class PgSubscriptionService {

  private readonly url: string
  private readonly maxRate = 500

  private blockEvents: Map<string, BlockEvents> = new Map()
  private blockMetricEvents: Map<string, BlockMetricEvents> = new Map()

  constructor(
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
    @Inject('winston') private readonly logger: Logger,
    private readonly config: ConfigService,
    private readonly blockService: BlockService,
    private readonly transactionService: TxService,
    private readonly blockMetricsService: BlockMetricsService,
  ) {

    this.url = config.db.url

    this.init()
  }

  private init() {

    const { url, logger, blockService, transactionService, blockMetricsService, pubSub } = this

    const events$ = Observable.create(
      async observer => {
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
    const blockMetrics$ = new Subject<string>()

    events$.subscribe(
      event => circuitBreaker.next(new PgEvent(event)),
      err => circuitBreaker.error(err),
    )

    circuitBreaker.subject
      .pipe(isCircuitBreakerState())
      .subscribe(event => {
        pubSub.publish('isSyncing', event.isOpen)
      })

    const pgEvents$ = circuitBreaker.subject
      .pipe(isPgEvent())

    //

    this.blockEvents = new Map()
    this.blockMetricEvents = new Map()

    pgEvents$
      .pipe(isBlockEvent())
      .subscribe(event => this.onBlockEvent(event, blockHashes$))

    pgEvents$
      .pipe(isBlockMetricEvent())
      .subscribe(event => this.onBlockMetricEvent(event, blockMetrics$))

    blockHashes$
      .pipe(
        bufferTime(100),
        filter(blockHashes => blockHashes.length > 0),
      )
      .subscribe(async blockHashes => {

        const blockSummaries = await blockService.findSummariesByBlockHash(blockHashes)

        blockSummaries.forEach(async blockSummary => {

          pubSub.publish('newBlock', blockSummary)

          const txSummaries = await transactionService.findSummariesByHash(blockSummary.transactionHashes || [])

          txSummaries.forEach(txSummary => {
            pubSub.publish('newTransaction', txSummary)
          })

          const hashRate = await blockService.calculateHashRate()
          pubSub.publish('hashRate', hashRate)
        })

      })

    blockMetrics$
      .pipe(
        bufferTime(100),
        filter(blockHashes => blockHashes.length > 0),
      )
      .subscribe(async blockHashes => {
        const metrics = await blockMetricsService.findByBlockHash(blockHashes)
        metrics.forEach(m => pubSub.publish('newBlockMetric', m))
      })

  }

  private onBlockEvent(event: PgEvent, blockHashes$: Subject<string>) {

    const { blockEvents, config } = this

    const { table, payload } = event
    const { block_hash } = payload

    let entry = blockEvents.get(block_hash)

    if (!entry) {
      entry = new BlockEvents(config.instaMining)
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

        if (trace.transaction_hash == null) {
          entry.rewardsTrace = trace
        } else {
          entry.txTrace = trace
        }

        break

      default:
        throw new Error(`Unexpected table name: ${table}`)

    }

    if (entry.isComplete) {
      // remove from the map and emit an event
      blockHashes$.next(block_hash)
      blockEvents.delete(block_hash)
    }

  }

  private onBlockMetricEvent(event: PgEvent, blockMetrics$: Subject<string>) {

    const { blockMetricEvents } = this

    const { table, payload } = event
    const { block_hash } = payload as BlockMetricPayload

    let entry = blockMetricEvents.get(block_hash)

    if (!entry) {
      entry = new BlockMetricEvents()
      blockMetricEvents.set(block_hash, entry)
    }

    switch (table) {

      case 'block_metrics_header':
        entry.header = true
        break

      case 'block_metrics_transaction':
        entry.transaction = true
        break

      case 'block_metrics_transaction_trace':
        entry.trace = true
        break

      case 'block_metrics_transaction_fee':
        entry.fee = true
        break

      default:
        throw new Error(`Unexpected table name: ${table}`)

    }

    if (entry.isComplete) {
      // remove from the map and emit an event
      blockMetrics$.next(block_hash)
      blockMetricEvents.delete(block_hash)
    }

  }

}
