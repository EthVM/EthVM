import { BlockService } from '@app/dao/block.service'
import { ConfigService } from '@app/shared/config.service'
import { Inject, Injectable } from '@nestjs/common'
import { PubSub } from 'graphql-subscriptions'
import createSubscriber from 'pg-listen'
import { Observable, Subject } from 'rxjs'
import { bufferTime, filter, map } from 'rxjs/operators'
import { Logger } from 'winston'
import { TxService } from '@app/dao/tx.service'
import { BlockMetricsService } from '@app/dao/block-metrics.service'
import { InjectEntityManager } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'
import { DbConnection } from '@app/orm/config'

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

export interface BlockMetricsTransactionPayload {
  block_hash: string
  timestamp: number
}

export interface BlockMetricsTransactionFeePayload {
  block_hash: string
  timestamp: number
}

export interface MetadataPayload {
  key: string
  value: string
}

export type PgEventPayload =
  CanonicalBlockHeaderPayload
  | TransactionPayload
  | TransactionReceiptPayload
  | TransactionTracePayload
  | BlockMetricsTransactionPayload
  | BlockMetricsTransactionFeePayload
  | MetadataPayload

export class PgEvent {

  public readonly table: string
  public readonly action: string
  public readonly payload: any

  constructor(data: any) {
    this.table = data.table
    this.action = data.action
    this.payload = data.payload
  }

}

function inputIsPgEvent(input: any): input is PgEvent {
  return input instanceof PgEvent
}

// tslint:disable-next-line:no-shadowed-variable
function isPgEvent<PgEvent>() {
  return (source$: Observable<any>) => source$.pipe(
    filter(inputIsPgEvent),
  )
}

// tslint:disable-next-line:no-shadowed-variable
function isMetadataEvent<PgEvent>() {

  const tables = new Set<string>([
    'metadata',
  ])

  return (source$: Observable<any>) => source$.pipe(
    filter(inputIsPgEvent),
    filter(e => tables.has(e.table)),
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
    filter(inputIsPgEvent),
    filter(e => tables.has(e.table)),
  )
}

// tslint:disable-next-line:no-shadowed-variable
function isBlockMetricsTransactionEvent<PgEvent>() {
  return (source$: Observable<any>) => source$.pipe(
    filter(inputIsPgEvent),
    filter(e => e.table === 'block_metrics_transaction'),
  )
}

// tslint:disable-next-line:no-shadowed-variable
function isBlockMetricsTransactionFeeEvent<PgEvent>() {
  return (source$: Observable<any>) => source$.pipe(
    filter(inputIsPgEvent),
    filter(e => e.table === 'block_metrics_transaction_fee'),
  )
}

class BlockEvents {

  header?: CanonicalBlockHeaderPayload

  rewardsTrace?: TransactionTracePayload
  txTrace?: TransactionTracePayload

  transactions: Map<string, TransactionPayload> = new Map()
  receipts: Map<string, TransactionReceiptPayload> = new Map()

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

  private readonly principalUrl: string
  private readonly metricsUrl: string

  private blockEvents: Map<string, BlockEvents> = new Map()

  constructor(
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
    @Inject('winston') private readonly logger: Logger,
    private readonly config: ConfigService,
    private readonly blockService: BlockService,
    private readonly transactionService: TxService,
    private readonly blockMetricsService: BlockMetricsService,
    @InjectEntityManager(DbConnection.Principal) private readonly principalEntityManager: EntityManager,
  ) {

    this.principalUrl = config.dbPrincipal.url
    this.metricsUrl = config.dbMetrics.url

    this.initPrincipal()
    this.initMetrics()
  }

  private initPrincipal() {

    const { principalUrl, blockService, transactionService, blockMetricsService, pubSub, principalEntityManager } = this

    const events$ = Observable.create(
      async observer => {
        try {
          const subscriber = createSubscriber({ connectionString: principalUrl })

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

    const blockHashes$ = new Subject<string>()

    const pgEvents$ = events$
      .pipe(
        map(event => new PgEvent(event)),
        isPgEvent(),
      )

    //

    this.blockEvents = new Map()

    pgEvents$
      .pipe(isMetadataEvent())
      .subscribe(event => this.onMetadataEvent(event))

    pgEvents$
      .pipe(isBlockEvent())
      .subscribe(event => this.onBlockEvent(event, blockHashes$))

    blockHashes$
      .pipe(
        bufferTime(100),
        filter(blockHashes => blockHashes.length > 0),
      )
      .subscribe(async blockHashes => {

        // clear query cache
        await principalEntityManager.connection.queryResultCache!.clear()

        const blockSummaries = await blockService.findSummariesByBlockHash(blockHashes, false)

        blockSummaries.forEach(async blockSummary => {

          // get data
          const txSummaries = await transactionService.findSummariesByHash(blockSummary.transactionHashes || [])
          const hashRate = await blockService.calculateHashRate()

          // publish events

          pubSub.publish('newBlock', blockSummary)

          txSummaries.forEach(txSummary => {
            pubSub.publish('newTransaction', txSummary)
          })

          pubSub.publish('hashRate', hashRate)
        })

      })

  }

  private initMetrics() {

    const { blockService, transactionService, blockMetricsService, pubSub } = this

    const events$ = Observable.create(
      async observer => {
        try {
          const subscriber = createSubscriber({ connectionString: this.metricsUrl })

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

    const blockMetrics$ = new Subject<string>()

    const pgEvents$ = events$
      .pipe(
        map(event => new PgEvent(event)),
        isPgEvent(),
      )

    //

    this.blockEvents = new Map()

    pgEvents$
      .pipe(isBlockMetricsTransactionEvent())
      .subscribe(event => this.onBlockMetricsTransactionEvent(event))

    pgEvents$
      .pipe(isBlockMetricsTransactionFeeEvent())
      .subscribe(event => this.onBlockMetricsTransactionFeeEvent(event))

    pgEvents$
      .pipe(isBlockMetricsTransactionFeeEvent())

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

  private async onMetadataEvent(event: PgEvent) {
    const { pubSub, principalEntityManager } = this
    const payload = event.payload as MetadataPayload

    switch (payload.key) {
      case 'sync_status':

        // clear query cache
        await principalEntityManager.connection.queryResultCache!.clear()

        const isSyncing = JSON.parse(payload.value)
        pubSub.publish('isSyncing', isSyncing)

        break

      default:
      // Do nothing
    }
  }

  private async onBlockMetricsTransactionEvent(event: PgEvent) {
    const { pubSub } = this
    const payload = event.payload as BlockMetricsTransactionPayload

    const metric = await this.blockMetricsService.findBlockMetricsTransactionByBlockHash(payload.block_hash, false)

    if (metric) {
      pubSub.publish('newBlockMetricsTransaction', metric)
    }

  }

  private async onBlockMetricsTransactionFeeEvent(event: PgEvent) {
    const { pubSub } = this
    const payload = event.payload as BlockMetricsTransactionPayload

    const metric = await this.blockMetricsService.findBlockMetricsTransactionFeeByBlockHash(payload.block_hash, false)

    if (metric) {
      pubSub.publish('newBlockMetricsTransactionFee', metric)
    }

  }

  private onBlockEvent(event: PgEvent, blockHashes$: Subject<string>) {

    const { blockEvents, config } = this

    const { table, payload } = event
    const { block_hash } = payload as any

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

}
