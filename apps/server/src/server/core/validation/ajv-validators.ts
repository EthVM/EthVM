import { isBuffer, isValidHash } from '@app/server/core/utils'
import * as Ajv from 'ajv'
import { isValidAddress } from 'ethereumjs-util'

// Define some constants
const PAGINATION_SIZE = 100

const ROOMS = ['blocks', 'txs', 'pendingTxs', 'uncles']
const PERIODS = ['ALL', 'YEAR', 'MONTH', 'DAY']

const EXCHANGE_TO = ['USD']
const EXCHANGE_FROM = [
  'BTC',
  'LTC',
  'XRP',
  'NXT',
  'DOGE',
  'DGB',
  'RDD',
  'DASH',
  'MONA',
  'MAID',
  'XMR',
  'BCN',
  'BTS',
  'BTCD',
  'XLM',
  'EMC',
  'XVG',
  'USDT',
  'XEM',
  'ETH',
  'SC',
  'REP',
  'DCR',
  'PIVX',
  'LSK',
  'DGD',
  'STEEM',
  'WAVES',
  'ARDR',
  'ETC',
  'STRAT',
  'NEO',
  'XZC',
  'ZEC',
  'GNT',
  'MKR',
  'KMD',
  'NANO',
  'ARK',
  'QTUM',
  'BAT',
  'ZEN',
  'AE',
  'ETP',
  'MIOTA',
  'BNT',
  'GXS',
  'FUN',
  'PAY',
  'SNT',
  'EOS',
  'MCO',
  'GAS',
  'PPT',
  'OMG',
  'BCH',
  'BNB',
  'BTM',
  'DCN',
  'ZRX',
  'HSR',
  'NAS',
  'WTC',
  'LRC',
  'TRX',
  'MANA',
  'LINK',
  'KNC',
  'KIN',
  'ADA',
  'XTZ',
  'RHOC',
  'CNX',
  'AION',
  'BTG',
  'KCS',
  'NULS',
  'ICX',
  'POWR',
  'QASH',
  'BCD',
  'CMT',
  'ELF',
  'WAX',
  'XIN',
  'MOAC',
  'IOST',
  'THETA',
  'ZIL',
  'ELA',
  'HT',
  'TUSD',
  'ONT',
  'BTCP',
  'DROP',
  'NPXS',
  'WAN',
  'MITH',
  'HOT',
  'VET'
]

// Create Ajv
const ajv = new Ajv()
require('ajv-keywords')(ajv, ['instanceof']) // tslint:disable-line no-var-requires

// Create custom data types
ajv.addKeyword('address', {
  validate: (schema, data) => isValidAddress(data),
  errors: false
})

ajv.addKeyword('addresBuffer', {
  validate: (schema, data) => isBuffer(data, 20),
  errors: false
})

ajv.addKeyword('hash', {
  validate: (schema, data) => isValidHash(data),
  errors: false
})

ajv.addKeyword('hashBuffer', {
  validate: (schema, data) => isBuffer(data, 32),
  errors: false
})

// Mini schemas definitions
const addressSchema = {
  $id: '/properties/address',
  type: 'string',
  address: true
}

const hashSchema = {
  $id: '/properties/hashstring',
  type: 'string',
  hash: true
}
const limitSchema = {
  $id: '/properties/limit',
  type: 'number',
  default: PAGINATION_SIZE
}

const pageSchema = {
  $id: '/properties/limit',
  type: 'number',
  default: 0
}

// Schemas definitions

const JoinLeavePayloadSchema = {
  $id: 'https://ethvm.com/join.leave.payload.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    rooms: {
      $id: '/properties/rooms',
      type: 'array',
      items: { type: 'string', enum: ROOMS },
      uniqueItems: true,
      minItems: 1
    }
  },
  required: ['rooms'],
  additionalItems: false,
  additionalProperties: false
}

const BalancePayloadSchema = {
  $id: 'https://ethvm.com/balance.payload.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    address: addressSchema
  },
  required: ['address'],
  additionalProperties: false
}

const BlockTxsPayloadSchema = {
  $id: 'https://ethvm.com/block.txs.payload.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    hash: hashSchema
  },
  required: ['hash'],
  additionalProperties: false
}

const BlockPayloadSchema = {
  $id: 'https://ethvm.com/block.payload.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    hash: hashSchema
  },
  required: ['hash'],
  additionalProperties: false
}

const ChartPayloadSchema = {
  $id: 'https://ethvm.com/chart.payload.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    duration: {
      $id: '/properties/duration',
      type: 'string',
      enum: PERIODS
    }
  },
  required: ['duration'],
  additionalProperties: false
}

const EthCallPayloadSchema = {
  $id: 'https://ethvm.com/eth.call.payload.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {},
  required: [],
  additionalProperties: false
}

const TokensBalancePayloadSchema = {
  $id: 'https://ethvm.com/tokens.balance.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    address: addressSchema
  },
  required: ['address'],
  additionalProperties: false
}

const TokensPayloadSchema = {
  $id: 'https://ethvm.com/tokens.payload.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    tokens: {
      $id: '/properties/tokens',
      type: 'array'
    }
  },
  required: ['tokens'],
  additionalProperties: false
}

const TotalTxsPayloadSchema = {
  $id: 'https://ethvm.com/total.txs.payload.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    address: addressSchema
  },
  required: ['address'],
  additionalProperties: false
}

const TxPayloadSchema = {
  $id: 'https://ethvm.com/tx.payload.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    hash: hashSchema
  },
  required: ['hash'],
  additionalProperties: false
}

const TxsPayloadSchema = {
  $id: 'https://ethvm.com/txs.payload.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    address: addressSchema,
    limit: limitSchema,
    page: pageSchema
  },
  required: ['address'],
  additionalProperties: false
}

const PastTxsSchema = {
  $id: 'https://ethvm.com/pasttxs.payload.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    limit: limitSchema,
    page: pageSchema
  },
  additionalProperties: false
}

const PastBlocksSchema = {
  $id: 'https://ethvm.com/pastblock.payload.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    limit: limitSchema,
    page: pageSchema
  },
  additionalProperties: false
}

const ExchangeRateSchema = {
  $id: 'https://ethvm.com/exchange.payload.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    symbol: {
      $id: '/properties/symbol',
      type: 'string',
      enum: EXCHANGE_FROM
    },
    to: {
      $id: '/properties/to',
      type: 'string',
      enum: EXCHANGE_TO
    }
  },
  required: ['symbol', 'to'],
  additionalProperties: false
}

// Compile schemas
const balancePayloadValidator = ajv.compile(BalancePayloadSchema)
const blockTxsPayloadValidator = ajv.compile(BlockTxsPayloadSchema)
const blockPayloadValidator = ajv.compile(BlockPayloadSchema)
const chartPayloadValidator = ajv.compile(ChartPayloadSchema)
const ethCallPayloadValidator = ajv.compile(EthCallPayloadSchema)
const joinLeavePayloadValidator = ajv.compile(JoinLeavePayloadSchema)
const tokensPayloadValidator = ajv.compile(TokensPayloadSchema)
const tokensBalancePayloadValidator = ajv.compile(TokensBalancePayloadSchema)
const txPayloadValidator = ajv.compile(TxPayloadSchema)
const txsPayloadValidator = ajv.compile(TxsPayloadSchema)
const totalTxsPayloadValidator = ajv.compile(TotalTxsPayloadSchema)
const pastTxsPayloadValidator = ajv.compile(PastTxsSchema)
const pastBlockPayloadValidator = ajv.compile(PastBlocksSchema)
const exchangeRatePayloadValidator = ajv.compile(ExchangeRateSchema)

export {
  balancePayloadValidator,
  blockTxsPayloadValidator,
  blockPayloadValidator,
  chartPayloadValidator,
  ethCallPayloadValidator,
  joinLeavePayloadValidator,
  tokensPayloadValidator,
  tokensBalancePayloadValidator,
  txPayloadValidator,
  txsPayloadValidator,
  totalTxsPayloadValidator,
  pastTxsPayloadValidator,
  exchangeRatePayloadValidator,
  pastBlockPayloadValidator
}
