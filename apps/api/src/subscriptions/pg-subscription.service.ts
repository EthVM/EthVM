import {BlockService} from '@app/dao/block.service'
import {ConfigService} from '@app/shared/config.service'
import {Inject, Injectable} from '@nestjs/common'
import {PubSub} from 'graphql-subscriptions'
import createSubscriber from 'pg-listen'
import {Observable, Subject} from 'rxjs'
import {bufferTime, filter, map} from 'rxjs/operators'
import {Logger} from 'winston'
import {TxService} from '@app/dao/tx.service'
import {BlockMetricsService} from '@app/dao/block-metrics.service'
import {InjectEntityManager} from '@nestjs/typeorm'
import {EntityManager} from 'typeorm'
import {MetadataService} from "@app/dao/metadata.service";
import BigNumber from "bignumber.js";

export interface SyncStatusPayload {
  earliest_block_number: string
}


export type PgEventPayload = SyncStatusPayload

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
function isSyncStatusEvent<PgEvent>() {
  return (source$: Observable<any>) => source$.pipe(
    filter(inputIsPgEvent),
    filter(e => e.table === 'sync_status')
  )
}

@Injectable()
export class PgSubscriptionService {

  private readonly dbUrl: string

  private latestBlockNumber: BigNumber | undefined = undefined

  constructor(
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
    @Inject('winston') private readonly logger: Logger,
    private readonly config: ConfigService,
    private readonly metadataService: MetadataService,
    private readonly blockService: BlockService,
    private readonly transactionService: TxService,
    private readonly blockMetricsService: BlockMetricsService,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {

    this.dbUrl = config.db.url

    this.initKeepAlive()
    this.init()
  }

  private initKeepAlive() {

    // we publish a keep alive every 30 seconds to prevent the web socket from closing
    const periodMs = 30000;

    const { pubSub } = this

    const keepAlive = () => {
      pubSub.publish('keepAlive', true);
      setTimeout(keepAlive, periodMs)
    }

    setTimeout(keepAlive, periodMs)
  }

  private async init() {

    const {dbUrl, blockService, transactionService, logger, pubSub, entityManager, metadataService} = this

    this.latestBlockNumber = await metadataService.latestBlockNumber(entityManager)

    const events$ = Observable.create(
      async observer => {
        try {
          const subscriber = createSubscriber({connectionString: dbUrl})

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

    pgEvents$
      .pipe(isSyncStatusEvent())
      .subscribe(event => this.onSyncStatusUpdate(event, blockHashes$))

    blockHashes$
      .pipe(
        bufferTime(100),
        filter(blockHashes => blockHashes.length > 0),
      )
      .subscribe(async blockHashes => {

        console.log('Block hashes', blockHashes)
        logger.info(
          `[Subscription service] New blocks available, count = %d, hashes = %s`,
          blockHashes.length,
          blockHashes,
        )

        // clear query cache
        await entityManager.connection.queryResultCache!.clear()

        const blockSummaries = await blockService.findSummariesByBlockHash(blockHashes, false)

        const publishPromises = blockSummaries.map(async blockSummary => {

          // get data
          const txSummaries = await transactionService.findSummariesByHash(blockSummary.transactionHashes || [])
          const hashRate = await blockService.calculateHashRate(false, blockSummary.number)

          const promises: Promise<void>[] = [];

          // publish events

          promises.push(pubSub.publish('newBlock', blockSummary))

          promises.push(pubSub.publish('newTransactions', txSummaries))

          txSummaries.forEach(txSummary => {
            promises.push(pubSub.publish('newTransaction', txSummary))
          })

          promises.push(pubSub.publish('hashRate', hashRate))

          return Promise.all(promises)
        })

        // await on all the promises, throwing an error if any of them failed
        await Promise.all(publishPromises);
      })

  }

  private async onSyncStatusUpdate(event: PgEvent, blockHashes$: Subject<string>) {

    const {pubSub, entityManager, metadataService, blockService} = this
    const payload = event.payload as SyncStatusPayload

    const latestBlockNumber = this.latestBlockNumber || new BigNumber(-1)
    const newBlockNumber = new BigNumber(payload.earliest_block_number)

    if(newBlockNumber.gt(latestBlockNumber)) {

      // TODO handle forks and review edge cases

      let numberToPublish = latestBlockNumber.plus(1)

      while (numberToPublish.lte(newBlockNumber)) {

        // TODO find a better way of doing this

        const block = await blockService.findByNumber(numberToPublish, newBlockNumber)

        if(block != null) {
          blockHashes$.next(block.hash)
        }
        numberToPublish = numberToPublish.plus(1)
      }

      this.latestBlockNumber = newBlockNumber

    }

    //

  }

}
