import  getTxsEvent  from '@app/server/events/address-txs'
import { TxsPayload } from '@app/server/core/payloads'
import { expect } from 'chai'
import { EthVMServer } from '@app/server/ethvm-server'
import {mock, instance, verify} from 'ts-mockito'
import * as SocketIO from 'socket.io'

let es:EthVMServer  = mock(EthVMServer)
let socket:any = mock(SocketIO)
let pl:TxsPayload = { address:'', limit:0, page:0}

describe('ethvm-server events', () => {
  describe('getTxsEvent event', () => {
    it('should return Promise<Tx[]>', () => {
      getTxsEvent.onEvent(es,socket,pl)
    })
  })
})

