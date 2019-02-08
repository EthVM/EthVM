import { isValidAddress, isValidHash } from '@app/server/core/utils'
import * as Ajv from 'ajv'
import { SocketRooms } from 'ethvm-common'

// Define some constants
const PAGINATION_SIZE = 100

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

ajv.addKeyword('hash', {
  validate: (schema, data) => isValidHash(data),
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

const idSchema = {
  $id: '/properties/id',
  type: 'string',
  enum: ['syncing']
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
      items: { type: 'string', enum: SocketRooms.DefaultRooms },
      uniqueItems: true,
      minItems: 1
    }
  },
  required: ['rooms'],
  additionalItems: false,
  additionalProperties: false
}

const GenericPayloadSchema = {
  $id: 'https://ethvm.com/generic.payload.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    address: addressSchema,
    holder: addressSchema,
    hash: hashSchema,
    number: {
      $id: '/properties/number',
      type: 'number'
    },
    filter: filterSchema,
    limit: limitSchema,
    page: pageSchema,
    id: idSchema
  },
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
const genericPayloadValidator = ajv.compile(GenericPayloadSchema)
const searchPayloadValidator = ajv.compile(SearchPayloadSchema)
const chartPayloadValidator = ajv.compile(ChartPayloadSchema)
const joinLeavePayloadValidator = ajv.compile(JoinLeavePayloadSchema)
const exchangeRatePayloadValidator = ajv.compile(ExchangeRateSchema)

export {
  genericPayloadValidator,
  chartPayloadValidator,
  joinLeavePayloadValidator,
  exchangeRatePayloadValidator,
  searchPayloadValidator
}
