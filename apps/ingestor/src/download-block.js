import { S3DB } from './datastore'
import Configs from './configs'
import fs from 'fs'
import BlockProcessor from './processors/process-block'

const db = new S3DB(Configs.S3_BUCKET)
const BLOCK_NUMBER = '0'

db.get(BLOCK_NUMBER).then(_block => {
  const b = new BlockProcessor(_block)
  b.getBalanceChangedAccounts()
  fs.writeFile('block-' + BLOCK_NUMBER + '.json', JSON.stringify(_block, null, 2), err => {
    if (err) console.log(err)
    console.log('Successfully Written to File.')
  })
})
