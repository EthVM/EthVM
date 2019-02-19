import { Config } from '@app/config'
import { KafkaConnector } from '@app/connectors/kafka-connector'
import { MongoConnector } from '@app/connectors/mongo-connector'
import { bufferTime, concatAll, concatMap, filter, tap } from 'rxjs/operators'
import { Block } from 'ethvm-common'
import { Observable, of } from 'rxjs'
import { BlockRecord } from '@app/models/block-record'

import assert from 'assert'

interface Tuple<A, B> {
  first: A,
  second: B
}

export async function Verify(config: Config) {

  const kafka = new KafkaConnector(config)

  const mongo = new MongoConnector(config)
  await mongo.init()

  let expectedNumber = 0

  const blockPairs$: Observable<Tuple<BlockRecord, Block>> = kafka.blocks$()
    .pipe(
      bufferTime(100),
      filter(blocks => !!blocks.length),
      concatMap(async blocks => {

        const ids = blocks.map(b => b.header._number)

        const mongoBlocks = await mongo.blocks(
          { _id: { $in: ids } },
          { _id: 1 }
        )

        const mongoBlocksById = new Map<number, Block>()
        mongoBlocks.forEach(b => mongoBlocksById.set(+b.header.number, b))

        return blocks
          .map(b => ({ first: b, second: mongoBlocksById.get(b.header._number) } as Tuple<BlockRecord, Block>))

      }),
      concatMap(pairs => pairs.map(p => of(p))),
      concatAll()
    )

  blockPairs$
    .pipe(
      tap(({ first, second }) => {
        // presence check
        assert(second, `No block found in mongo for number = ${first.header._number}`)
      }),
      tap(({ first, second }) => {

        // compare headers

        const source = first.header;
        const mongo = second.header;

        assert(source._number.toString() === expectedNumber.toString(), `Expected block number = ${expectedNumber}, source block number = ${source._number}`);
        assert(source._number.toString() === mongo.number, `Block number mismatch between source and mongo. Expected = ${source._number}, mongo = ${+mongo.number}`);

        assert(source.hash.toString('hex') === mongo.hash, `Hash mismatch. Source = ${source.hash.toString('hex')}, mongo = ${mongo.hash}`);
        assert(source.parentHash.toString('hex') === mongo.parentHash, `parentHash mismatch. Source = ${source.parentHash.toString('hex')}, mongo = ${mongo.parentHash}`);
        // assert(source.nonce.toString('hex') === mongo.nonce, `Nonce mismatch. Source = ${source.nonce.toString('hex')}, mongo = ${mongo.nonce}`);
        assert(source.sha3Uncles.toString('hex') === mongo.sha3Uncles, `sha3Uncles mismatch. Source = ${source.sha3Uncles.toString('hex')}, mongo = ${mongo.sha3Uncles}`);
        assert(source.logsBloom.toString('hex') === mongo.logsBloom, `logsBloom mismatch. Source = ${source.logsBloom.toString('hex')}, mongo = ${mongo.logsBloom}`);
        assert(source.transactionsRoot.toString('hex') === mongo.transactionsRoot, `transactionsRoot mismatch. Source = ${source.transactionsRoot.toString('hex')}, mongo = ${mongo.transactionsRoot}`);
        assert(source.stateRoot.toString('hex') === mongo.stateRoot, `stateRoot mismatch. Source = ${source.stateRoot.toString('hex')}, mongo = ${mongo.stateRoot}`);
        assert(source.receiptsRoot.toString('hex') === mongo.receiptsRoot, `receiptsRoot mismatch. Source = ${source.receiptsRoot.toString('hex')}, mongo = ${mongo.receiptsRoot}`);
        assert(source.author.toString('hex') === mongo.author, `author mismatch. Source = ${source.author.toString('hex')}, mongo = ${mongo.author}`);

        assert(source._difficulty.toString() === mongo.difficulty, `difficulty mismatch. Source = ${source._difficulty}, mongo = ${mongo.difficulty}`);
        assert(source._gasLimit.toString() === mongo.gasLimit, `gasLimit mismatch. Source = ${source._gasLimit}, mongo = ${mongo.gasLimit}`);
        assert(source._gasUsed.toString() === mongo.gasUsed, `gasUsed mismatch. Source = ${source._gasUsed}, mongo = ${mongo.gasUsed}`);

        assert(source.timestamp === mongo.timestamp, `Timestamp mismatch. Source = ${source.timestamp}, mongo = ${mongo.timestamp}`);

        expectedNumber += 1

      }),
      tap(({ first, second }) => {

        // check transactions

        const source = first.transactions || [];
        const mongo = second.transactions || [];

        assert(source.length === mongo.length, `Tx count mismatch. Source = ${source.length}, mongo = ${mongo.length}`);

        source.forEach((sourceTx, idx) => {

          const mongoTx = mongo[idx];

          assert(sourceTx.hash.toString('hex') === mongoTx.hash, `Tx hash mismatch. Source = ${sourceTx.hash.toString('hex')}, mongo = ${mongoTx.hash}`);
          // assert(sourceTx.nonce.toString('hex') === mongoTx.nonce, `Tx nonce mismatch. Source = ${sourceTx.nonce.toString('hex')}, mongo = ${mongoTx.nonce}`);
          assert(sourceTx.blockHash.toString('hex') === mongoTx.blockHash, `Tx blockHash mismatch. Source = ${sourceTx.blockHash.toString('hex')}, mongo = ${mongoTx.blockHash}`);


        });

      })
    )
    .subscribe(
      ({ first }) => console.log(`Finished processing block number = ${first.header._number}`),
      err => {
        console.error('Error', err);
        process.exit(1);
      },
      () => {
        console.log('Finished');
        process.exit(0)
      }
    );

}
