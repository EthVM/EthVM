import { S3DB } from './datastore'
import Configs from './configs'
import fs from 'fs'
import BlockProcessor from './processors/process-block'

const db = new S3DB(Configs.S3_BUCKET)
const BLOCK_NUMBER = '1'
const ERC_20_PREFIX = Configs.TOKEN_KEY_PREFIX
console.log(ERC_20_PREFIX)

// db.get(BLOCK_NUMBER).then(_block => {
//   const b = new BlockProcessor(_block)
//   b.getBalanceChangedAccounts()
//   fs.writeFile('block-' + BLOCK_NUMBER + '.json', JSON.stringify(_block, null, 2), err => {
//     if (err) console.log(err)
//     console.log('Successfully Written to File.')
//   })
// })

db.get(ERC_20_PREFIX + BLOCK_NUMBER).then(_block => {
  fs.writeFile('block-erc20-' + BLOCK_NUMBER + '.json', JSON.stringify(_block, null, 2), err => {
    if (err) console.log(err)
    console.log('Successfully Written to File.')
  })
})
