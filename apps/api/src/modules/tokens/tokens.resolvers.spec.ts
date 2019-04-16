import { Test } from '@nestjs/testing'
import { TokenService } from './token-transfer.service'
import { TokenResolvers } from './token-transfer.resolvers'
import { EthService } from '../../shared/eth.service'
import { TokenTransferEntity } from '../../orm/entities/token-transfer.entity'
import { TokenTransferDto } from './dto/token-transfer.dto'
import { VmEngineService } from '../../shared/vm-engine.service'
import { EthplorerTokenOperationDto } from './dto/ethplorer-token-operation.dto'
import { EthplorerTokenHolderDto } from './dto/ethplorer-token-holder.dto'
import { EthplorerAddressInfoDto } from './dto/ethplorer-address-info.dto'
import { TokenDto } from './dto/token.dto'
import { add } from 'winston'
import { BlockDto } from '../blocks/block.dto'
import { ContractDto } from '../contracts/contract.dto'
import { take } from 'rxjs/operators'

const addressOne = '0000000000000000000000000000000000000001'
const addressTwo = '0000000000000000000000000000000000000002'
const addressThree = '0000000000000000000000000000000000000003'

const holderOne = '0000000000000000000000000000000000000004'
const holderTwo = '0000000000000000000000000000000000000005'
const holderThree = '0000000000000000000000000000000000000006'
const holderFour = '0000000000000000000000000000000000000007'

const hashOne = '0x0000000000000000000000000000000000000000000000000000000000000001'
const hashTwo = '0x0000000000000000000000000000000000000000000000000000000000000002'
const hashThree = '0x0000000000000000000000000000000000000000000000000000000000000003'
const hashFour = '0x0000000000000000000000000000000000000000000000000000000000000004'
const hashFive = '0x0000000000000000000000000000000000000000000000000000000000000005'
const hashSix = '0x0000000000000000000000000000000000000000000000000000000000000006'
const hashSeven = '0x0000000000000000000000000000000000000000000000000000000000000007'
const hashEight = '0x0000000000000000000000000000000000000000000000000000000000000008'
const hashNine = '0x0000000000000000000000000000000000000000000000000000000000000009'
const hashTen = '0x00000000000000000000000000000000000000000000000000000000000000010'

const tokenTransfers = [
  { id: { hash: hashOne }, contract: addressOne, from: holderOne, to: holderTwo },
  { id: { hash: hashTwo }, contract: addressOne, from: holderOne, to: holderTwo },
  { id: { hash: hashThree }, contract: addressTwo, from: holderOne, to: holderTwo },
  { id: { hash: hashFour }, contract: addressOne, from: holderOne, to: holderTwo },
  { id: { hash: hashFive }, contract: addressTwo, from: holderOne, to: holderTwo },
  { id: { hash: hashSix }, contract: addressOne, from: holderThree, to: holderFour },
  { id: { hash: hashSeven }, contract: addressTwo, from: holderThree, to: holderFour },
  { id: { hash: hashEight }, contract: addressOne, from: holderThree, to: holderFour },
  { id: { hash: hashNine }, contract: addressTwo, from: holderThree, to: holderFour },
  { id: { hash: hashTen }, contract: addressOne, from: holderThree, to: holderFour }
]

const tokenHashOne = '0000000000000000000000000000000000000001'
const transactionHashOne = '0x0000000000000000000000000000000000000000000000000000000000000001'
const transactionHashTwo = '0x0000000000000000000000000000000000000000000000000000000000000002'
const transactionHashThree = '0x0000000000000000000000000000000000000000000000000000000000000003'

const ethplorerTokenOperations = [
  { transactionHash: transactionHashOne, tokenInfo: { address: addressOne, owner: holderOne } },
  { transactionHash: transactionHashTwo, tokenInfo: { address: addressTwo, owner: holderOne } },
  { transactionHash: transactionHashThree, tokenInfo: { address: addressOne, owner: holderTwo } }
]

const ethplorerTokenHolders = [{ address: addressOne }, { address: addressTwo }, { address: addressOne }]

const ethplorerHolderInfo = [{ address: addressOne, holder: holderOne }]

const mockService = {
  async findAddressTokenTransfers(address, take = 10, page = 0) {
    const start = take * page
    const end = start + take
    const transfersForAddress = tokenTransfers.filter(t => t.contract === address)
    const items = transfersForAddress.slice(start, end)
    return items.map(i => new TokenTransferEntity(i))
  },
  async findAddressTokenTransfersByHolder(address, holder, filter, take = 10, page = 0) {
    const start = take * page
    const end = start + take
    const transfersForAddress = tokenTransfers.filter(t => t.contract === address)
    let transfersByHolder
    switch (filter) {
      case 'in':
        transfersByHolder = transfersForAddress.filter(t => t.from === holder)
        break
      case 'out':
        transfersByHolder = transfersForAddress.filter(t => t.to === holder)
        break
      default:
        transfersByHolder = transfersForAddress.filter(t => t.from === holder || t.to === holder)
    }
    const items = transfersByHolder.slice(start, end)
    return items.map(i => new TokenTransferEntity(i))
  },
  async fetchTokenHistory(address) {
    const items = ethplorerTokenOperations.filter(e => e.tokenInfo.address === address)
    return items.map(e => new EthplorerTokenOperationDto(e))
  },
  async fetchTokenHolders(address) {
    const items = ethplorerTokenHolders.filter(e => e.address === address)
    return items.map(e => new EthplorerTokenHolderDto(e))
  },
  async fetchAddressInfo(address, holderAddress) {
    const item = ethplorerHolderInfo.find(e => e.address === address && e.holder === holderAddress)
    return item ? new EthplorerAddressInfoDto(item) : null
  },
  async fetchAddressHistory(address, holderAddress) {
    const items = ethplorerTokenOperations.filter(e => e.tokenInfo.address === address && e.tokenInfo.owner === holderAddress)
    return items.map(i => new EthplorerTokenOperationDto(i))
  },
  async findAddressAllTokensOwned(address) {}
}

const mockVmEngine = {
  async fetchAddressAmountTokensOwned(address) {}
}

describe('TokenTransferResolvers', () => {
  let tokenTransferService: TokenService
  let tokenTransferResolvers: TokenResolvers
  let vmEngine: VmEngineService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TokenResolvers,
        EthService,
        {
          provide: TokenService,
          useValue: mockService
        },
        {
          provide: VmEngineService,
          useValue: mockVmEngine
        }
      ]
    }).compile()
    tokenTransferService = module.get<TokenService>(TokenService)
    tokenTransferResolvers = module.get<TokenResolvers>(TokenResolvers)
    vmEngine = module.get<VmEngineService>(VmEngineService)
  })

  describe('addressTokenTransfers', () => {
    it('should return an array of TokenTransferDto instances with contract matching the address provided', async () => {
      const transfersByAddressOne = await tokenTransferResolvers.addressTokenTransfers(addressOne)
      const transfersByAddressTwo = await tokenTransferResolvers.addressTokenTransfers(addressTwo)

      expect(transfersByAddressOne).toHaveLength(6)
      expect(transfersByAddressOne[0]).toBeInstanceOf(TokenTransferDto)
      expect(transfersByAddressOne[0]).toHaveProperty('id', { hash: hashOne })
      expect(transfersByAddressOne[0]).toHaveProperty('contract', addressOne)

      expect(transfersByAddressTwo).toHaveLength(4)
      expect(transfersByAddressTwo[0]).toBeInstanceOf(TokenTransferDto)
      expect(transfersByAddressTwo[0]).toHaveProperty('id', { hash: hashThree })
      expect(transfersByAddressTwo[0]).toHaveProperty('contract', addressTwo)

      expect(transfersByAddressOne).not.toEqual(transfersByAddressTwo)
    })

    it('should respect given limit and page parameters', async () => {
      const transfersOne = await tokenTransferResolvers.addressTokenTransfers(addressOne, 2, 0)
      expect(transfersOne).toHaveLength(2)
      expect(transfersOne[0]).toHaveProperty('id', { hash: hashOne })
      expect(transfersOne[1]).toHaveProperty('id', { hash: hashTwo })

      const transfersTwo = await tokenTransferResolvers.addressTokenTransfers(addressOne, 2, 1)
      expect(transfersTwo).toHaveLength(2)
      expect(transfersTwo[0]).toHaveProperty('id', { hash: hashFour })
      expect(transfersTwo[1]).toHaveProperty('id', { hash: hashSix })

      // Check an empty array is returned if no items available for requested page
      const transfersThree = await tokenTransferResolvers.addressTokenTransfers(addressThree, 10, 1)
      expect(transfersThree).toHaveLength(0)
    })

    it('should convert an array of TokenTransferEntity instances to an array of TokenTransferDto instances', async () => {
      const tokenTransfers = await tokenTransferResolvers.addressTokenTransfers(addressOne)
      const expected = [
        new TokenTransferDto({ id: { hash: hashOne }, contract: addressOne, from: holderOne, to: holderTwo }),
        new TokenTransferDto({ id: { hash: hashTwo }, contract: addressOne, from: holderOne, to: holderTwo }),
        new TokenTransferDto({ id: { hash: hashFour }, contract: addressOne, from: holderOne, to: holderTwo }),
        new TokenTransferDto({ id: { hash: hashSix }, contract: addressOne, from: holderThree, to: holderFour })
      ]
      expect(tokenTransfers).toEqual(expect.arrayContaining(expected))
    })
  })

  describe('addressTokenTransfersByHolder', () => {
    it('should return an array of TokenTransferDto instances with contract matching the address and holder provided', async () => {
      const transfersByAddressOne = await tokenTransferResolvers.addressTokenTransfersByHolder(addressOne, holderOne)
      const transfersByAddressTwo = await tokenTransferResolvers.addressTokenTransfersByHolder(addressTwo, holderTwo)

      expect(transfersByAddressOne).toHaveLength(3)
      expect(transfersByAddressOne[0]).toBeInstanceOf(TokenTransferDto)
      expect(transfersByAddressOne[0]).toHaveProperty('id', { hash: hashOne })
      expect(transfersByAddressOne[0]).toHaveProperty('contract', addressOne)
      expect(transfersByAddressOne[0]).toHaveProperty('from', holderOne)

      expect(transfersByAddressTwo).toHaveLength(2)
      expect(transfersByAddressTwo[0]).toBeInstanceOf(TokenTransferDto)
      expect(transfersByAddressTwo[0]).toHaveProperty('id', { hash: hashThree })
      expect(transfersByAddressTwo[0]).toHaveProperty('contract', addressTwo)
      expect(transfersByAddressTwo[0]).toHaveProperty('to', holderTwo)

      expect(transfersByAddressOne).not.toEqual(transfersByAddressTwo)
    })

    it('should respect given limit and page parameters', async () => {
      const transfersOne = await tokenTransferResolvers.addressTokenTransfersByHolder(addressOne, holderOne, 'all', 2, 0)
      expect(transfersOne).toHaveLength(2)
      expect(transfersOne[0]).toHaveProperty('id', { hash: hashOne })
      expect(transfersOne[1]).toHaveProperty('id', { hash: hashTwo })

      const transfersTwo = await tokenTransferResolvers.addressTokenTransfersByHolder(addressOne, holderOne, 'all', 2, 1)
      expect(transfersTwo).toHaveLength(1)
      expect(transfersTwo[0]).toHaveProperty('id', { hash: hashFour })

      // Check an empty array is returned if no items available for requested page
      const transfersThree = await tokenTransferResolvers.addressTokenTransfersByHolder(addressThree, holderThree, 'all', 10, 1)
      expect(transfersThree).toHaveLength(0)
    })

    it('should convert an array of TokenTransferEntity instances to an array of TokenTransferDto instances', async () => {
      const tokenTransfers = await tokenTransferResolvers.addressTokenTransfersByHolder(addressOne, holderOne)
      const expected = [
        new TokenTransferDto({ id: { hash: hashOne }, contract: addressOne, from: holderOne, to: holderTwo }),
        new TokenTransferDto({ id: { hash: hashTwo }, contract: addressOne, from: holderOne, to: holderTwo }),
        new TokenTransferDto({ id: { hash: hashFour }, contract: addressOne, from: holderOne, to: holderTwo })
      ]
      expect(tokenTransfers).toEqual(expect.arrayContaining(expected))
    })

    it('should only return TokenTransferDto instances matching the filter provided', async () => {
      const transfersIn = await tokenTransferResolvers.addressTokenTransfersByHolder(addressOne, holderThree, 'in')
      const transfersOut = await tokenTransferResolvers.addressTokenTransfersByHolder(addressOne, holderThree, 'out')

      expect(transfersIn).toHaveLength(3)
      expect(transfersOut).toHaveLength(0)
    })
  })

  describe('tokenHistory', () => {
    it('should return an array of EthplorerTokenOperationDto instances matching the token address hash provided', async () => {
      const tokenOperationsOne = await tokenTransferResolvers.tokenHistory(addressOne)
      const tokenOperationsTwo = await tokenTransferResolvers.tokenHistory(addressTwo)

      expect(tokenOperationsOne).toHaveLength(2)
      expect(tokenOperationsOne[0]).toHaveProperty('tokenInfo', { address: addressOne, owner: holderOne })
      expect(tokenOperationsOne[0]).toBeInstanceOf(EthplorerTokenOperationDto)

      expect(tokenOperationsTwo).toHaveLength(1)
      expect(tokenOperationsTwo[0]).toHaveProperty('tokenInfo', { address: addressTwo, owner: holderOne })
      expect(tokenOperationsOne[0]).toBeInstanceOf(EthplorerTokenOperationDto)

      expect(tokenOperationsOne).not.toEqual(tokenOperationsTwo)
    })

    it('should return an empty array if there are no EthplorerTokenOperations matching the address provided', async () => {
      const tokenOperations = await tokenTransferResolvers.tokenHistory(addressThree)
      expect(tokenOperations).toHaveLength(0)
    })
  })

  describe('topTokenHolders', () => {
    it('should return an array of EthplorerTokenHolderDto instances matching the address provided', async () => {
      const tokenHoldersOne = await tokenTransferResolvers.topTokenHolders(addressOne)
      const tokenHoldersTwo = await tokenTransferResolvers.topTokenHolders(addressTwo)

      expect(tokenHoldersOne).toHaveLength(2)
      expect(tokenHoldersOne[0]).toHaveProperty('address', addressOne)
      expect(tokenHoldersOne[0]).toBeInstanceOf(EthplorerTokenHolderDto)

      expect(tokenHoldersTwo).toHaveLength(1)
      expect(tokenHoldersTwo[0]).toHaveProperty('address', addressTwo)
      expect(tokenHoldersOne[0]).toBeInstanceOf(EthplorerTokenHolderDto)

      expect(tokenHoldersOne).not.toEqual(tokenHoldersTwo)
    })

    it('should return an empty array if there are no EthplorerTokenHolders matching the address provided', async () => {
      const tokenHolders = await tokenTransferResolvers.topTokenHolders(addressThree)
      expect(tokenHolders).toHaveLength(0)
    })
  })

  describe('holderDetails', () => {
    it('should return an instance of EthplorerAddressInfoDto matching the token address hash and holder address hash provided', async () => {
      const holderInfo = await tokenTransferResolvers.holderDetails(addressOne, holderOne)

      expect(holderInfo).toBeInstanceOf(EthplorerAddressInfoDto)
      expect(holderInfo).toHaveProperty('address', addressOne)
    })

    it('should return null if no matching instances are found', async () => {
      const holderInfo = await tokenTransferResolvers.holderDetails(addressTwo, holderTwo)

      expect(holderInfo).toBe(null)
    })
  })

  describe('holderTransfers', () => {
    it('should return an array of EthplorerTokenOperationDto instances matching the token address hash and holder address hash provided', async () => {
      const tokenOperationsOne = await tokenTransferResolvers.holderTransfers(addressOne, holderOne)

      expect(tokenOperationsOne).toHaveLength(1)
      expect(tokenOperationsOne[0]).toHaveProperty('tokenInfo', { address: addressOne, owner: holderOne })
      expect(tokenOperationsOne[0]).toBeInstanceOf(EthplorerTokenOperationDto)
    })

    it('should return an empty array if no matching instances are found', async () => {
      const tokenOperations = await tokenTransferResolvers.holderTransfers(addressThree, holderThree)
      expect(tokenOperations).toHaveLength(0)
    })
  })

  describe('addressAllTokensOwned', () => {
    it('should return an array of TokenDto instances matching the token address hash provided', async () => {
      const result = { name: 'Test', symbol: 'TST' }

      jest.spyOn(tokenTransferService, 'findAddressAllTokensOwned').mockImplementation(
        () =>
          new Promise(resolve => {
            resolve([new TokenDto(result)])
          })
      )

      expect(await tokenTransferResolvers.addressAllTokensOwned(tokenHashOne)).toEqual([new TokenDto(result)])
    })
  })

  describe('addressAmountTokensOwned', () => {
    it('should return the total number of tokens owned by a given address', async () => {
      jest.spyOn(vmEngine, 'fetchAddressAmountTokensOwned').mockImplementation(
        () =>
          new Promise(resolve => {
            resolve(100)
          })
      )

      expect(await tokenTransferResolvers.addressAmountTokensOwned(holderOne)).toEqual(100)
    })
  })
})
