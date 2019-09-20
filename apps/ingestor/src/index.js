import cliProgress from 'cli-progress'
import { S3DB } from './datastore'
import Configs from './configs'
import Status from './status'
import getWeb3 from './getWeb3'
import processBlock from './processBlock'
import SNS from './helpers/sns-publish'

const HOST = Configs.WS_HOST
const MAX_CONCURRENT = Configs.MAX_CONCURRENT
const WEB3_INSTANCES = []

for (let i = 0; i < MAX_CONCURRENT; i++) {
  WEB3_INSTANCES.push(getWeb3(HOST))
}

const volatileStatus = {
  currentBlock: null,
  toBeProcessed: [],
  processingBlocks: [],
  maxBlock: 0
}
const getCustomWeb3 = getWeb3
const web3 = getCustomWeb3(HOST)
const db = new S3DB(Configs.S3_BUCKET)
const sns = new SNS(Configs.AWS_SNS_TOPIC)
const status = new Status(db)

const multibar = new cliProgress.MultiBar(
  {
    clearOnComplete: false,
    hideCursor: true
  },
  cliProgress.Presets.shades_grey
)
const blockProcessorBar = multibar.create(volatileStatus.currentBlock, volatileStatus.currentBlock)

const setProcessed = blockNum => {
  volatileStatus.processingBlocks.forEach(value => {
    if (value.number === blockNum) value.processed = true
  })
  const arrLength = volatileStatus.processingBlocks.length
  for (let i = 0; i < arrLength; i++) {
    if (volatileStatus.processingBlocks[0].processed) {
      if (volatileStatus.processingBlocks[0].number % 100 === 0 && Configs.SAVE_STATUS)
        status.setLastBlock(volatileStatus.processingBlocks[0].number).then(() => {})
      blockProcessorBar.update(volatileStatus.processingBlocks[0].number)
      const blockInfo = volatileStatus.processingBlocks.shift()
      if (Configs.PUBLISH_SNS) sns.publish(blockInfo.number)
    } else break
  }
}

const asyncRunner = () => {
  if (volatileStatus.toBeProcessed.length > 0) {
    const blockNum = volatileStatus.toBeProcessed.shift()
    volatileStatus.processingBlocks.push({
      number: blockNum,
      processed: false
    })
    const web3 = WEB3_INSTANCES[blockNum % MAX_CONCURRENT]
    processBlock(blockNum, web3).then(_block => {
      _block.Metadata = {
        number: _block.number.toString(),
        hash: _block.hash,
        parentHash: _block.parentHash
      }
      db.put(_block.number, _block)
        .then(() => {
          setProcessed(_block.number)
          if (volatileStatus.currentBlock < volatileStatus.maxBlock) {
            volatileStatus.currentBlock++
            volatileStatus.toBeProcessed.push(volatileStatus.currentBlock)
            asyncRunner()
          }
        })
        .catch(console.error)
    })
  }
}

web3.eth.getBlockNumber().then(_blockNumber => {
  volatileStatus.maxBlock = _blockNumber
  status.getLastBlock().then(lastProcessedBlock => {
    volatileStatus.currentBlock = 22757
    blockProcessorBar.setTotal(volatileStatus.maxBlock)
    for (let i = 0; i < MAX_CONCURRENT; i++) {
      if (volatileStatus.currentBlock < volatileStatus.maxBlock) {
        volatileStatus.toBeProcessed.push(volatileStatus.currentBlock + i)
        asyncRunner()
      }
    }
  })
})

web3.eth.subscribe('newBlockHeaders').on('data', block => {
  if (volatileStatus.currentBlock === volatileStatus.maxBlock && block.number > volatileStatus.maxBlock) {
    console.log('new max block received, initiating processing', block.number)
    volatileStatus.toBeProcessed.push(block.number)
    volatileStatus.currentBlock = block.number
    asyncRunner()
  } else if (block.number < volatileStatus.currentBlock) {
    console.log('reorg detected, starting to reprocess from', block.number)
    volatileStatus.currentBlock = block.number - 1
    volatileStatus.toBeProcessed.push(block.number)
    asyncRunner()
  }
  if (block.number > volatileStatus.maxBlock) {
    volatileStatus.maxBlock = block.number
    blockProcessorBar.setTotal(volatileStatus.maxBlock)
  }
})
