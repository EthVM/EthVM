import commander from 'commander'
import Ora from 'ora'
import * as r from 'rethinkdb'

const version = '1.0.0'

export const hexToBuffer = (hex: string): Buffer => Buffer.from(hex.toLowerCase().replace('0x', ''), 'hex')
const ora = new Ora({
  color: 'yellow'
})

const tx1 = {
  blockHash: hexToBuffer(''),
  cofrom: [hexToBuffer('0x8b2a6d0b4183b5db91bb901eefdd0d0ba06ef125'), hexToBuffer('0xbe1c42bed6b0d9b8811c744e831f1bf14abc7d66')],
  blockNumber: 2,
  contractAddress: null,
  cumulativeGasUsed: Buffer.from(''),
  from: hexToBuffer('0xbe1c42bed6b0d9b8811c744e831f1bf14abc7d66'),
  fromBalance: Buffer.from('78'),
  gas: Buffer.from('78'),
  gasPrice: Buffer.from('7'),
  gasUsed: Buffer.from('9'),
  hash: '0xff7ac9e368c483f73d34595780cdee65e8d44c40c26ff8bd3ce53c48035a863e',
  input: Buffer.from(''),
  logsBloom: null,
  nonce: Buffer.from(''),
  pending: false,
  r: Buffer.from(''),
  to: hexToBuffer('0x8b2a6d0b4183b5db91bb901eefdd0d0ba06ef125'),
  toBalance: Buffer.from(''),
  transactionIndex: Buffer.from(''),
  v: Buffer.from(''),
  value: Buffer.from(''),
  status: true,
  timestamp: Buffer.from('')
}

const tx2  = {
  blockHash: hexToBuffer('0x983e535f45911199e74bec284b258b643392855eeb27e812aae902d149061dd7'),
  blockNumber: 3,
  contractAddress: null,
  cumulativeGasUsed: Buffer.from(''),
  cofrom: [hexToBuffer('0x8a9ac2ce73b37d1719989a854f83d456762ea303'), hexToBuffer('0xf57556eb4f8df2ae8e070edc38728eb9c17378b5')],
  from: hexToBuffer('0xf57556eb4f8df2ae8e070edc38728eb9c17378b5'),
  fromBalance: Buffer.from(''),
  gas: Buffer.from(''),
  gasPrice: Buffer.from(''),
  gasUsed: Buffer.from(''),
  hash: '0xb371a109b3ac732765fc3daa64db4bec96075048e359e003b68ba9a8f16ec6d6',
  input: Buffer.from(''),
  logsBloom: null,
  nonce: Buffer.from(''),
  pending: false,
  r: Buffer.from(''),
  to: hexToBuffer('0x8a9ac2ce73b37d1719989a854f83d456762ea303'),
  toBalance: Buffer.from(''),
  transactionIndex: Buffer.from(''),
  v: Buffer.from(''),
  value: Buffer.from(''),
  status: true,
  timestamp: Buffer.from('')
}

const blockStat = {
  blockTime: '',
  failed: '',
  success: '',
  avgGasPrice: '',
  avgTxFees: '',
  pendingTxs: 8
}

const block1 = {
  number: 2,
  hash: '0x0041061b4de06bb3243312dc0795f8b2ee6a40611d86f401a9679fb0c0bee1bf',
  parentHash: hexToBuffer('0xb903239f8543d04b5dc1ba6519132b143087c68db1b2168786408fcbce568238'),
  miner: hexToBuffer('0xd9ea042ad059033ba3c3be79f4081244f183bf03'),
  timestamp: Buffer.from(''),
  transactionHashes: [
    '0xff7ac9e368c483f73d34595780cdee65e8d44c40c26ff8bd3ce53c48035a863e',
    '0xb371a109b3ac732765fc3daa64db4bec96075048e359e003b68ba9a8f16ec6d6'
  ],
  transactionCount: 2,
  isUncle: false
}

const block2 = {
  number: 2,
  hash: '0xb003239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238',
  parentHash: hexToBuffer('0xb903239f8543d04b5dc1ba6519132b143087c68db1b2168786408fcbce568238'),
  miner: hexToBuffer('0xd9ea042ad059033ba3c3be79f4081244f183bf03'),
  timestamp: Buffer.from(''),
  transactionHashes: [
    '0xff7ac9e368c483f73d34595780cdee65e8d44c40c26ff8bd3ce53c48035a863e',
    '0xb371a109b3ac732765fc3daa64db4bec96075048e359e003b68ba9a8f16ec6d6'
  ],
  transactionCount: 2,
  isUncle: false
}

commander
  .command('generate')
  .alias('g')
  .action(() => {
    r.connect(
      { host: 'localhost', port: 28015 },
      function(err, conn) {
        if (err) {
          ora.info(`Error Connecting database `)
        }
        // TODO resolve this callback hell
        r.dbCreate('eth_mainnet').run(conn, function(err, cursor) {
          r.db('eth_mainnet')
            .tableCreate('transactions')
            .run(conn, function(err, cursor) {
              r.db('eth_mainnet')
                .table('transactions')
                .insert([tx1, tx2])
                .run(conn, function(err, cursor) {
                  r.db('eth_mainnet')
                    .tableCreate('blocks')
                    .run(conn, function(err, cursor) {
                      r.db('eth_mainnet')
                        .table('blocks')
                        .insert([block1, block2])
                        .run(conn, function(err, cursor) {
                          r.db('eth_mainnet')
                            .table('transactions')
                            .indexCreate('cofrom', { multi: true })
                            .run(conn, function(err, cursor) {
                              r.db('eth_mainnet')
                                .table('transactions')
                                .indexCreate('to')
                                .run(conn, function(err, cursor) {
                                  r.db('eth_mainnet')
                                    .table('transactions')
                                    .indexCreate('from')
                                    .run(conn, function(err, cursor) {
                                      r.db('eth_mainnet')
                                        .table('blocks')
                                        .indexCreate('hash')
                                        .run(conn, function(err, cursor) {
                                          process.exit(0)
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
      }
    )
  })

commander.parse(process.argv)
