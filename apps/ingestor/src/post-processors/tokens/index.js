import cliProgress from 'cli-progress'
import fs from 'fs'
import Configs from '../../configs'
import { getBlockAndProcess } from './process'
import getWeb3 from '../../getWeb3'

const volatileStatus = {
  currentBlock: null,
  toBeProcessed: [],
  processingBlocks: [],
  maxBlock: 0
}
const STATUS_FILE = 'block-token-status.json'
const HOST = Configs.WS_HOST
const MAX_CONCURRENT = 3
const WEB3_INSTANCES = []

for (let i = 0; i < MAX_CONCURRENT; i++) {
  WEB3_INSTANCES.push(getWeb3(HOST))
}

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
      if (volatileStatus.processingBlocks[0].number % 100 === 0)
        fs.writeFileSync(STATUS_FILE, JSON.stringify({ number: volatileStatus.processingBlocks[0].number }), 'utf8')
      blockProcessorBar.update(volatileStatus.processingBlocks[0].number)
      volatileStatus.processingBlocks.shift()
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
    getBlockAndProcess(blockNum, web3).then(_blockNumber => {
      setProcessed(_blockNumber)
      if (volatileStatus.currentBlock < volatileStatus.maxBlock) {
        volatileStatus.currentBlock++
        let isProcessing = false
        volatileStatus.processingBlocks.forEach(_b => {
          if (_b.number === volatileStatus.currentBlock) isProcessing = true
        })
        if (!isProcessing) volatileStatus.toBeProcessed.push(volatileStatus.currentBlock)
        asyncRunner()
      }
    })
  }
}

WEB3_INSTANCES[0].eth.getBlockNumber().then(_blockNumber => {
  volatileStatus.maxBlock = _blockNumber
  const lastProcessedBlock = JSON.parse(fs.readFileSync(STATUS_FILE, 'utf8')).number
  volatileStatus.currentBlock = lastProcessedBlock
  blockProcessorBar.setTotal(volatileStatus.maxBlock)
  for (let i = 0; i < MAX_CONCURRENT; i++) {
    if (volatileStatus.currentBlock < volatileStatus.maxBlock) {
      volatileStatus.toBeProcessed.push(volatileStatus.currentBlock + i)
      asyncRunner()
    }
  }
})
