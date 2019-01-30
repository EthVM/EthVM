import { isBuffer, isValidAddress, isValidHash } from '@app/server/core/utils'
import * as Ajv from 'ajv'

// Define some constants
const PAGINATION_SIZE = 100

const ROOMS = ['blocks', 'txs', 'pendingTxs', 'uncles']
const PERIODS = ['ALL', 'YEAR', 'MONTH', 'WEEK']

const EXCHANGE_TO = ['USD']
const EXCHANGE_FROM = ['ETH']

// Create Ajv
const ajv = new Ajv()
require('ajv-keywords')(ajv, ['instanceof']) // tslint:disable-line no-var-requires

// Create custom data types
ajv.addKeyword('address', {
  validate: (schema, data: string) => {
    if (!data.startsWith('0x')) {
      data = '0x' + data
    }
    return isValidAddress(data)
  },
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

const filterSchema = {
  $id: '/properties/limit',
  type: 'string',
  enum: ['in', 'out', 'all'],
  default: 'all'
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
      items: { type: 'string', enum: [ROOMS] },
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
const BlockByNumberPayloadSchema = {
  $id: 'https://ethvm.com/block.by.number.payload.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    number: {
      $id: '/properties/number',
      type: 'number'
    }
  },
  required: ['number'],
  additionalProperties: false
}

const SearchPayloadSchema = {
  $id: 'https://ethvm.com/search.payload.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    hash: {
      $id: '/properties/hash',
      type: 'string'
    }
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
    filter: filterSchema,
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
const BlocksMinedSchema = {
  $id: 'https://ethvm.com/blocksmined.payload.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    address: addressSchema,
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

const TokensTransferSchema = {
  $id: 'https://ethvm.com/tokentransfers.payload.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    address: addressSchema,
    holder: addressSchema,
    filter: filterSchema,
    limit: limitSchema,
    page: pageSchema
  },
  additionalProperties: false
}

const ContractSchema = {
  $id: 'https://ethvm.com/contracts.schema.json',
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

// Compile schemas
const balancePayloadValidator = ajv.compile(BalancePayloadSchema)
const blockTxsPayloadValidator = ajv.compile(BlockTxsPayloadSchema)
const blockPayloadValidator = ajv.compile(BlockPayloadSchema)
const blockByNumberPayloadValidator = ajv.compile(BlockByNumberPayloadSchema)
const searchpayloadValidator = ajv.compile(SearchPayloadSchema)
const chartPayloadValidator = ajv.compile(ChartPayloadSchema)
const ethCallPayloadValidator = ajv.compile(EthCallPayloadSchema)
const joinLeavePayloadValidator = ajv.compile(JoinLeavePayloadSchema)
const tokensPayloadValidator = ajv.compile(TokensPayloadSchema)
const tokensBalancePayloadValidator = ajv.compile(TokensBalancePayloadSchema)
const txPayloadValidator = ajv.compile(TxPayloadSchema)
const txsPayloadValidator = ajv.compile(TxsPayloadSchema)
const totalTxsPayloadValidator = ajv.compile(TotalTxsPayloadSchema)
const pastBlockPayloadValidator = ajv.compile(PastBlocksSchema)
const blockMinedPayloadValidator = ajv.compile(BlocksMinedSchema)
const exchangeRatePayloadValidator = ajv.compile(ExchangeRateSchema)
const pendingTxsPayloadValidator = ajv.compile(TxsPayloadSchema)
const tokenTransferPayloadValidator = ajv.compile(TokensTransferSchema)
const contractSchemaPayloadValidator = ajv.compile(ContractSchema)

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
  exchangeRatePayloadValidator,
  blockMinedPayloadValidator,
  searchpayloadValidator,
  blockByNumberPayloadValidator,
  pastBlockPayloadValidator,
  pendingTxsPayloadValidator,
  tokenTransferPayloadValidator,
  contractSchemaPayloadValidator
}
