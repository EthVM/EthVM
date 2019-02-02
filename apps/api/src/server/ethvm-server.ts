import config from '@app/config'
import { Callback } from '@app/interfaces'
import { logger } from '@app/logger'
import { errors } from '@app/server/core/exceptions'
import { Streamer, StreamingEvent } from '@app/server/core/streams'
import { AddressesService } from '@app/server/modules/addresses'
import { BalancesService } from '@app/server/modules/balances'
import { toBlockMetrics } from '@app/server/modules/block-metrics'
import { BlocksService, toBlock } from '@app/server/modules/blocks'
import { ContractsService } from '@app/server/modules/contracts'
import { ExchangeService } from '@app/server/modules/exchanges'
import { PendingTxService, toPendingTx } from '@app/server/modules/pending-txs'
import { SearchService } from '@app/server/modules/search'
import { StatisticsService } from '@app/server/modules/statistics'
import { TokensService } from '@app/server/modules/tokens'
import { TxsService } from '@app/server/modules/txs'
import { UnclesService } from '@app/server/modules/uncles'
import { Block, Events, Tx } from 'ethvm-common'
import * as fs from 'fs'
import * as http from 'http'
import * as SocketIO from 'socket.io'

export type SocketEventPayload = any

export type SocketEventResponse = Block | Block[] | Tx | Tx[] | number | any

export interface SocketEventValidationResult {
  readonly valid: boolean
  readonly errors?: any[]
}

export interface SocketEvent {
  id: string
  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any) => SocketEventValidationResult
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload?: SocketEventPayload) => Promise<SocketEventResponse>
}

export class EthVMServer {
  public io: SocketIO.Server

  private server
  private readonly events: Map<string, SocketEvent> = new Map()

  constructor(
    public readonly addressesService: AddressesService,
    public readonly blockService: BlocksService,
    public readonly contractsService: ContractsService,
    public readonly uncleService: UnclesService,
    public readonly balancesService: BalancesService,
    public readonly txsService: TxsService,
    public readonly statisticsService: StatisticsService,
    public readonly pendingTxService: PendingTxService,
    public readonly exchangesService: ExchangeService,
    public readonly searchService: SearchService,
    public readonly tokensService: TokensService,
    private readonly streamer: Streamer
  ) {}

  public async start() {
    logger.debug('EthVMServer - createWSServer() / Creating http server')
    this.server = http.createServer()
    const opts = {
      host: config.get('server.host'),
      port: config.get('server.port')
    }

    logger.debug('EthVMServer - createWSServer() / Starting listening on http server')
    this.server.listen(opts, () => {
      logger.debug(`EthVMServer - createWSServer() / Http server listening on ${opts.host}:${opts.port}`)
    })

    logger.debug('EthVMServer - createWSServer() / Creating SocketIO server')
    this.io = SocketIO(this.server)

    logger.debug('EthVMServer - start() / Loading socket events...')
    const events = fs.readdirSync(`${__dirname}/events/`)
    events.forEach(async ev => {
      logger.debug(`EthVMServer - start() / Registering socket event: ${ev}`)
      const event = await import(`${__dirname}/events/${ev}`)
      this.events.set(event.default.id, event.default)
    })

    logger.debug('EthVMServer - start() / Registering streamer events')
    this.streamer.addListener('block', this.onBlockEvent)
    this.streamer.addListener('pendingTx', this.onPendingTxEvent)
    this.streamer.addListener('blockStat', this.onBlockStatEvent)

    logger.debug('EthVMServer - start() / Starting to listen socket events on SocketIO')
    this.io.on('connection', (socket: SocketIO.Socket): void => this.registerSocketEventsOnConnection(socket))
  }

  public async stop() {
    const socketPromise = new Promise(resolve => this.io.close(() => resolve(true)))
    const serverPromise = new Promise(resolve => this.server.close(() => resolve(true)))
    return Promise.all([socketPromise, serverPromise])
  }

  private registerSocketEventsOnConnection(socket: SocketIO.Socket): void {
    this.events.forEach(
      (event: SocketEvent): void => {
        socket.on(
          event.id,
          (payload: any, cb?: Callback): void => {
            const validationResult = event.onValidate(this, socket, payload)
            if (!validationResult.valid) {
              logger.error(`event -> ${event.id} / Invalid payload: ${JSON.stringify(payload)}`)
              if (cb) {
                cb(errors.BAD_REQUEST, null)
              }
              return
            }

            event
              .onEvent(this, socket, payload)
              .then(res => {
                // Some events like join, leave doesn't produce a concrete result, so better to not send anything back
                if (typeof res === 'undefined') {
                  return
                }

                if (cb) {
                  cb(null, res)
                }
              })
              .catch(err => {
                logger.error(`event -> ${event.id} / Error: ${err}`)

                // TODO: Until we have defined which errors we are going to return, we use a generic one
                if (cb) {
                  cb(errors.INTERNAL_SERVER_ERROR, null)
                }
              })
          }
        )
      }
    )
  }

  private onBlockEvent = (event: StreamingEvent): void => {
    const { op, key, value } = event

    logger.info(`EthVMServer - onBlockEvent / Op: ${op} - Number: ${key} - Hash: ${value.header.hash}`)

    const blockEvent: StreamingEvent = { op, key, value: toBlock(value) }

    this.io.to('blocks').emit(Events.NEW_BLOCK, blockEvent)
  }

  private onBlockStatEvent = (event: StreamingEvent): void => {
    const { op, key, value } = event

    logger.info(`EthVMServer - onBlockStatEvent / Op: ${op} - Number: ${key} - Stat: ${value}`)

    const blockStatEvent: StreamingEvent = { op, key, value: toBlockMetrics(value) }

    this.io.to('blocks').emit(Events.NEW_BLOCK_STAT, blockStatEvent)
  }

  private onPendingTxEvent = (event: StreamingEvent): void => {
    const { op, key, value } = event

    logger.info(`EthVMServer - onPendingTxEvent / Op: ${op} - Hash: ${value.hash}`)

    const pendingTxEvent: StreamingEvent = { op, key, value: toPendingTx(value) }

    this.io.to('pendingTxs').emit(Events.NEW_PENDING_TX, pendingTxEvent)
  }
}
