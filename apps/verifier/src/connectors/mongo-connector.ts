import { Config } from '@app/config'
import { Block, Header, Tx } from 'ethvm-common'
import { Collection, Cursor, Db, MongoClient } from 'mongodb'
import { empty, from, Observable } from 'rxjs'
import { concatMap, expand } from 'rxjs/operators'

export class MongoConnector {
  private readonly client: MongoClient
  private readonly dbName: string

  private db: Db

  constructor(config: Config) {
    const { url } = config.mongo

    // quick hack for getting database name from the url
    this.dbName = url.split('?')[0].split('/')[3]

    this.client = new MongoClient(url, { useNewUrlParser: true })
  }

  async init(): Promise<void> {
    const { client } = this
    await client.connect()
    this.db = client.db(this.dbName)
  }

  private get blocksCollection(): Collection<Block> {
    return this.db.collection<Block>('blocks')
  }

  private get unclesCollection(): Collection<Header> {
    return this.db.collection<Header>('uncles')
  }

  private get transactionsCollection(): Collection<Tx> {
    return this.db.collection<Tx>('transactions')
  }

  async blocks(filter: any, sort?: any): Promise<Block[]> {
    return await this.blocksCollection
      .find(filter)
      .sort(sort)
      .toArray()
  }

  blocks$(): Observable<Block> {
    const cursor = this.blocksCollection.find().batchSize(50)

    return this.cursor$(cursor)
  }

  private cursor$<T>(cursor: Cursor<T>): Observable<T> {
    const next$ = () => from(cursor.hasNext()).pipe(concatMap(x => (x ? from(<Promise<T>>cursor.next()) : empty())))

    return next$().pipe(expand(() => next$()))
  }
}
