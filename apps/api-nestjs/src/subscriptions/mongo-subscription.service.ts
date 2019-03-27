import { ChangeStream, Cursor, getConnection, getMongoManager, getRepository, MongoRepository, Repository } from 'typeorm'
import { Inject, Injectable } from '@nestjs/common'
import { PubSub } from 'graphql-subscriptions'
import { Logger } from 'winston'
import { BlockEntity } from '@app/orm/entities/block.entity'
import { InjectRepository } from '@nestjs/typeorm'

export interface StreamingEvent {
  op: 'insert' | 'delete' | 'replace' | 'updated' | 'invalidate'
  key: any
  value: any
}

@Injectable()
export class MongoSubscriptionService {

  blocksReader
  blockMetricsReader

  constructor(@Inject('PUB_SUB') private readonly pubSub: PubSub,
              @Inject('winston') private readonly logger: Logger,
              @InjectRepository(BlockEntity) private readonly blockRepository: MongoRepository<BlockEntity>) {
    this.initialize()
  }

  public async initialize() {

    const { logger, pubSub } = this

    // Create stream readers
    logger.info('MongoStreamer - initialize() / Generating stream readers')
    this.blocksReader = new ChangeStreamReader('blocks', pubSub, logger)
    this.blockMetricsReader = new ChangeStreamReader('blockMetrics', pubSub, logger)

    // TODO only start if syncing has finished
    this.blocksReader.start()
    this.blockMetricsReader.start()

  }

}

class ChangeStreamReader {
  private changeStream: ChangeStream
  private cursor: Cursor<any>

  constructor(private readonly collectionName: string, private readonly pubSub: PubSub, private readonly logger: Logger) {}

  public start() {
    this.logger.info(`MongoChangeStreamReader - start() / Starting to listen change events on: ${this.collectionName}`)
    const manager = getMongoManager()
    const changeStream = (this.changeStream = manager.queryRunner.watch(this.collectionName, [], { fullDocument: 'updateLookup' }))
    this.cursor = changeStream.stream()
    this.pull()
  }

  public async stop() {
    this.logger.info(`MongoChangeStreamReader - start() / Stopping to listen change events on: ${this.collectionName}`)
    if (this.changeStream) {
      await this.changeStream.close()
    }
  }

  private async pull() {
    const { cursor, pubSub, collectionName } = this

    try {
      this.logger.info('MongoChangeStreamReader - pull() / Waiting for event:', collectionName)

      while (!cursor.isClosed()) {
        const next = await cursor.next()

        if (next != null) {
          const { operationType, fullDocument, documentKey } = next
          const event: StreamingEvent = {
            op: operationType,
            key: documentKey._id,
            value: fullDocument
          }
          await pubSub.publish(collectionName, event)
        }
      }
    } catch (e) {
      this.logger.error('MongoChangeStreamReader - pull() / Failed to pull', this.collectionName, ' with error:', e)
    }
  }
}
