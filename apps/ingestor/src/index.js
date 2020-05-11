import cliProgress from 'cli-progress'
import { S3DB } from './datastore'
import Configs from './configs'
import Status from './status'
import getWeb3 from './getWeb3'
import processBlock from './processBlock'
import SNS from './helpers/sns-publish'
import WSNotif from './helpers/ws-publish'
import InfluxPublish from './helpers/influx-cloud-publish'

const HOST = Configs.WS_HOST
const MAX_CONCURRENT = Configs.MAX_CONCURRENT
const WEB3_INSTANCES = []
let IS_SYNCED = false

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
const dbGz = new S3DB(Configs.S3_BUCKET_GZ)
const sns = new SNS(Configs.AWS_SNS_TOPIC)
const wsNotif = new WSNotif()
const influxPublish = new InfluxPublish()
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
      if (Configs.PUBLISH_WS) wsNotif.publish(blockInfo.number)
      if (Configs.PUBLISH_INFLUX) influxPublish.publish(blockInfo.number)
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
      Promise.all([db.put(_block.number, _block), dbGz.putgz(`${Configs.CHAIN}/blocks/block=${_block.number}/block.json.gz`, _block)]).then(() => {
        setProcessed(_block.number)
        if (volatileStatus.currentBlock < volatileStatus.maxBlock) {
          volatileStatus.currentBlock++
          let isProcessing = false
          volatileStatus.processingBlocks.forEach(_b => {
            if (_b.number === volatileStatus.currentBlock) isProcessing = true
          })
          if (!isProcessing) volatileStatus.toBeProcessed.push(volatileStatus.currentBlock)
          asyncRunner()
        } else {
          IS_SYNCED = true
        }
      })
      //        .catch(console.error)
    })
  }
}

web3.eth.getBlockNumber().then(_blockNumber => {
  volatileStatus.maxBlock = _blockNumber
  status.getLastBlock().then(lastProcessedBlock => {
    volatileStatus.currentBlock = lastProcessedBlock
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
  if (IS_SYNCED) {
    volatileStatus.currentBlock = block.number
    volatileStatus.toBeProcessed.push(block.number)
    asyncRunner()
  }
  if (block.number > volatileStatus.maxBlock) {
    volatileStatus.maxBlock = block.number
    blockProcessorBar.setTotal(volatileStatus.maxBlock)
  }
})
