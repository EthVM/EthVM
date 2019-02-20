import { Config } from '@app/config'
import { KafkaConnector } from '@app/connectors/kafka-connector'
import { MongoConnector } from '@app/connectors/mongo-connector'
import { BlockHeaderRecord } from '@app/models/block-header-record'
import { BlockRecord } from '@app/models/block-record'
import assert from 'assert'
import { Block, Header } from 'ethvm-common'
import { Observable, of } from 'rxjs'
import { bufferTime, concatAll, concatMap, filter, tap } from 'rxjs/operators'

const verifyBlockHeader = (source: BlockHeaderRecord, mongo: Header) => {
  assert(source._number === mongo.number, `Block number mismatch between source and mongo. Expected = ${source._number}, mongo = ${mongo.number}`)
  assert(source.hash.toString('hex') === mongo.hash, `Hash mismatch. Source = ${source.hash.toString('hex')}, mongo = ${mongo.hash}`)
  assert(source.parentHash.toString('hex') === mongo.parentHash, `parentHash mismatch. Source = ${source.parentHash.toString('hex')}, mongo = ${mongo.parentHash}`)
  assert(source.nonce.toString('hex') === mongo.nonce, `Nonce mismatch. Source = ${source.nonce.toString('hex')}, mongo = ${mongo.nonce}`)
  assert(source.sha3Uncles.toString('hex') === mongo.sha3Uncles, `sha3Uncles mismatch. Source = ${source.sha3Uncles.toString('hex')}, mongo = ${mongo.sha3Uncles}`)
  assert(source.logsBloom.toString('hex') === mongo.logsBloom, `logsBloom mismatch. Source = ${source.logsBloom.toString('hex')}, mongo = ${mongo.logsBloom}`)
  assert(source.transactionsRoot.toString('hex') === mongo.transactionsRoot, `transactionsRoot mismatch. Source = ${source.transactionsRoot.toString('hex')}, mongo = ${mongo.transactionsRoot}`)
  assert(source.stateRoot.toString('hex') === mongo.stateRoot, `stateRoot mismatch. Source = ${source.stateRoot.toString('hex')}, mongo = ${mongo.stateRoot}`)
  assert(source.receiptsRoot.toString('hex') === mongo.receiptsRoot, `receiptsRoot mismatch. Source = ${source.receiptsRoot.toString('hex')}, mongo = ${mongo.receiptsRoot}`)
  assert(source.author.toString('hex') === mongo.author, `author mismatch. Source = ${source.author.toString('hex')}, mongo = ${mongo.author}`)
  assert(source._difficulty.toString() === mongo.difficulty, `difficulty mismatch. Source = ${source._difficulty}, mongo = ${mongo.difficulty}`)
  assert(source._gasLimit.toString() === mongo.gasLimit, `gasLimit mismatch. Source = ${source._gasLimit}, mongo = ${mongo.gasLimit}`)
  assert(source._gasUsed.toString() === mongo.gasUsed, `gasUsed mismatch. Source = ${source._gasUsed}, mongo = ${mongo.gasUsed}`)
  assert(source.timestamp === mongo.timestamp, `Timestamp mismatch. Source = ${source.timestamp}, mongo = ${mongo.timestamp}`)
}

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

        // Generic block information

        const source = first
        const mongo = second

        assert(source._totalDifficulty.toString() === mongo.totalDifficulty, `Total Difficulty mismatch. Source = ${source.totalDifficulty.toString()}, mongo = ${mongo.totalDifficulty}`)
        assert(source.unclesHash.toString('hex') === mongo.unclesHash, `Uncles Hash mismatch. Source = ${source.unclesHash.toString()}, mongo = ${mongo.unclesHash}`)

      }),
      tap(({ first, second }) => {

        // compare headers

        const source = first.header
        const mongo = second.header

        assert(source._number.toString() === expectedNumber.toString(), `Expected block number = ${expectedNumber}, source block number = ${source._number}`)
        verifyBlockHeader(source, mongo)

        expectedNumber += 1

      }),
      tap(({ first, second }) => {

        // check transactions

        const source = first.transactions || []
        const mongo = second.transactions || []

        assert(source.length === mongo.length, `Tx count mismatch. Source = ${source.length}, mongo = ${mongo.length}`)

        source.forEach((sourceTx, idx) => {

          const mongoTx = mongo[idx];

          assert(sourceTx.hash.toString('hex') === mongoTx.hash, `Tx hash mismatch. Source = ${sourceTx.hash.toString('hex')}, mongo = ${mongoTx.hash}`)
          assert(sourceTx._nonce.toString() === mongoTx.nonce, `Tx nonce mismatch. Source = ${sourceTx._nonce}, mongo = ${mongoTx.nonce}`)
          assert(sourceTx.blockHash.toString('hex') === mongoTx.blockHash, `Tx block hash mismatch. Source = ${sourceTx.blockHash.toString('hex')}, mongo = ${mongoTx.blockHash}`)
          if (sourceTx.blockNumber) {
            assert(sourceTx.blockNumber.toString() === mongoTx.blockHash, `Tx block number mismatch. Source = ${sourceTx.blockHash.toString('hex')}, mongo = ${mongoTx.blockHash}`)
          }
          assert(sourceTx.transactionIndex === mongoTx.transactionIndex, `Tx index number mismatch. Source = ${sourceTx.transactionIndex}, mongo = ${mongoTx.transactionIndex}`)
          assert(sourceTx.from.toString('hex') === mongoTx.from, `Tx from hash mismatch. Source = ${sourceTx.from.toString('hex')}, mongo = ${mongoTx.from}`)
          if (sourceTx.to) {
            assert(sourceTx.to.toString('hex') === mongoTx.to, `Tx to hash mismatch. Source = ${sourceTx.to.toString('hex')}, mongo = ${mongoTx.to}`)
          }
          assert(sourceTx._value === mongoTx.value, `Tx value mismatch. Source = ${sourceTx._value}, mongo = ${mongoTx.value}`)
          assert(sourceTx._gasPrice === mongoTx.gasPrice, `Tx gas price value mismatch. Source = ${sourceTx._gasPrice}, mongo = ${mongoTx.gasPrice}`)
          assert(sourceTx._gas === mongoTx.gas, `Tx gas value mismatch. Source = ${sourceTx._gas}, mongo = ${mongoTx.gas}`)
          if (sourceTx.input) {
            assert(sourceTx.input.toString('hex') === mongoTx.input, `Tx input value mismatch. Source = ${sourceTx.input.toString('hex')}, mongo = ${mongoTx.input}`)
          }
          // assert(sourceTx._v === mongoTx.v, `Tx V value mismatch. Source = ${sourceTx._v}, mongo = ${mongoTx.v}`)
          assert(sourceTx.r.toString('hex') === mongoTx.r, `Tx R value mismatch. Source = ${sourceTx.r.toString('hex')}, mongo = ${mongoTx.r}`)
          assert(sourceTx.s.toString('hex') === mongoTx.s, `Tx S value mismatch. Source = ${sourceTx.s.toString('hex')}, mongo = ${mongoTx.s}`)
          assert(sourceTx.timestamp === mongoTx.timestamp, `Timestamp mismatch. Source = ${sourceTx.timestamp}, mongo = ${mongoTx.timestamp}`)
        })

      }),
      tap(({ first, second }) => {

        // check uncles

        const source = first.uncles || []
        const mongo = second.uncles || []

        assert(source.length === mongo.length, `Uncles count mismatch. Source = ${source.length}, mongo = ${mongo.length}`)

        source.forEach((sourceUncle, idx) => {
          const mongoUncle = mongo[idx];
          verifyBlockHeader(sourceUncle, mongoUncle)
        })

      }),
      tap(({ first, second }) => {

        // Rewards

        const source = first.rewards || []
        const mongo = second.rewards || []

        assert(source.length === mongo.length, `Rewards count mismatch. Source = ${source.length}, mongo = ${mongo.length}`)

        source.forEach((sourceReward, idx) => {

          const mongoReward = mongo[idx]

          assert(sourceReward.address.toString('hex') === mongoReward.address, `Hash mismatch. Source = ${sourceReward.address.toString('hex')}, mongo = ${mongoReward.address}`)
          assert(sourceReward._reward.toString() === mongoReward.reward, `Hash mismatch. Source = ${sourceReward._reward.toString()}, mongo = ${mongoReward.reward}`)
        })
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
