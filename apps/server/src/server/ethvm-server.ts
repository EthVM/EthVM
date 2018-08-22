import config from '@app/config'
import { Callback } from '@app/interfaces'
import { logger } from '@app/logger'
import * as c from '@app/server/core/constants/server.json'
import { errors } from '@app/server/core/exceptions'
import {
  AddressTxsPagesPayload,
  BalancePayload,
  BlocksTxsPayload,
  ChartPayload,
  EthCallPayload,
  ExchangeRatePayload,
  JoinLeavePayload,
  TokensBalancePayload,
  TxsPayload
} from '@app/server/core/payloads'
import { Streamer, StreamerEvents } from '@app/server/core/streams'
import { Block, BlocksService, mappers, SmallBlock } from '@app/server/modules/blocks'
import { ChartService } from '@app/server/modules/charts'
import { ExchangeService } from '@app/server/modules/exchanges'
import { Tx, TxsService } from '@app/server/modules/txs'
import { VmService } from '@app/server/modules/vm'
import { CacheRepository } from '@app/server/repositories'
import { bufferToHex } from 'ethereumjs-util'
import * as fs from 'fs'
import * as http from 'http'
import * as SocketIO from 'socket.io'

export type SocketEventPayload =
  | AddressTxsPagesPayload
  | BalancePayload
  | BlocksTxsPayload
  | Buffer
  | ChartPayload
  | EthCallPayload
  | ExchangeRatePayload
  | JoinLeavePayload
  | TokensBalancePayload
  | TxsPayload
  | any

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
  public readonly io: SocketIO.Server

  private readonly events: Map<string, SocketEvent>

  constructor(
    public readonly blockService: BlocksService,
    public readonly txsService: TxsService,
    public readonly chartsService: ChartService,
    public readonly exchangesService: ExchangeService,
    public readonly vmService: VmService,
    private readonly streamer: Streamer,
    private readonly ds: CacheRepository
  ) {
    this.io = this.createWSServer()
    this.events = new Map()
  }

  public async start() {
    logger.debug('EthVMServer - start() / Registering for streamer events')
    this.streamer.addListener(StreamerEvents.newBlock, this.onNewBlockEvent)
    this.streamer.addListener(StreamerEvents.newTx, this.onNewTxEvent)
    this.streamer.addListener(StreamerEvents.newPendingTx, this.onNewPendingTxsEvent)

    logger.debug('EthVMServer - start() / Loading socket evens...')
    const events = fs.readdirSync(`${__dirname}/events/`)
    events.forEach(async ev => {
      if (ev.match(/.*\.spec\.ts/)) {
        // Ignore test files
        return
      }
      logger.debug(`EthVMServer - start() / Registering socket event: ${ev}`)
      const event = await import(`${__dirname}/events/${ev}`)
      this.events.set(event.default.id, event.default)
    })

    logger.debug('EthVMServer - start() / Starting to listen socket events on SocketIO')
    this.io.on(
      'connection',
      (socket: SocketIO.Socket): void => {
        this.registerSocketEventsOnConnection(socket)
      }
    )
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
                cb(validationResult.errors, null)
              }
              return
            }

            logger.info(`event -> ${event.id} / New event received!`)

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

                // TODO: Until we have defined which errors are we going to return, we use a generic one
                if (cb) {
                  cb(errors.serverError, null)
                }
              })
          }
        )
      }
    )
  }

  private createWSServer(): SocketIO.Server {
    logger.debug('EthVMServer - createWSServer() / Creating SocketIO server')
    const server = http.createServer()
    const opts = {
      host: config.get('server.host'),
      port: config.get('server.port')
    }
    server.listen(opts, () => {
      logger.debug(`EthVMServer - createWSServer() / Web server listening on ${opts.host}:${opts.port}`)
    })

    return SocketIO(server)
  }

  private onNewBlockEvent = (block: SmallBlock): void => {
    logger.info(`EthVMServer - onNewBlockEvent / Block: ${bufferToHex(block.hash)}`)
    const blockHash = bufferToHex(block.hash)
    this.io.to(blockHash).emit(`${blockHash}_update`, block)
    this.io.to(c.server.rooms.blocks).emit(c.server.events.new_block, block)
  }

  private onNewTxEvent = (tx: Tx): void => {
    logger.info(`EthVMServer - onNewTxEvent / Tx: ${tx}`)
    const txHash = bufferToHex(tx.hash)
    this.io.to(txHash).emit(`${txHash}_update`, tx)
    this.io.to(c.server.rooms.txs).emit(c.server.events.new_tx, [tx])
  }

  private onNewPendingTxsEvent = (tx: Tx): void => {
    logger.info(`EthVMServer - onNewPendingTxsEvent / Tx: ${tx}`)
    const txHash = bufferToHex(tx.hash)
    this.io.to(txHash).emit(`${txHash}_update`, tx)
    this.io.to(c.server.rooms.pending_txs).emit(c.server.events.new_pending_tx, tx)
  }
}
