import { Repository } from '@app/server/repositories'
import { Db } from 'mongodb'

export const MongoEthVM = {
  collections: {
    blocks: 'blocks'
  }
}

export abstract class BaseMongoDbRepository implements Repository {
  constructor(protected readonly db: Db) {}
}
