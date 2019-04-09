import { Test } from '@nestjs/testing'
import { TokenTransferService } from './token-transfer.service'
import { TokenTransferResolvers } from './token-transfer.resolvers'
import { EthService } from '../../shared/eth.service'
import { TokenTransferEntity } from '../../orm/entities/token-transfer.entity'
import { TokenTransferDto } from './dto/token-transfer.dto'
import { VmEngineService } from '../../shared/vm-engine.service'
import { EthplorerTokenOperationDto } from './dto/ethplorer-token-operation.dto'
import { EthplorerTokenHolderDto } from './dto/ethplorer-token-holder.dto'
import { EthplorerAddressInfoDto } from './dto/ethplorer-address-info.dto'
import { TokenDto } from './dto/token.dto'

const mockService = {
  async findAddressTokenTransfers(address, take, page) {},
  async findAddressTokenTransfersByHolder(address, holder, filter, limit, page) {},
  async fetchTokenHistory(address) {},
  async fetchTokenHolders(address) {},
  async fetchAddressInfo(address, holderAddress) {},
  async fetchAddressHistory(address, holderAddress) {},
  async findAddressAllTokensOwned(address) {}
}

const mockVmEngine = {
  async fetchAddressAmountTokensOwned(address) {}
}

describe('TokenTransferResolvers', () => {
  let tokenTransferService: TokenTransferService
  let tokenTransferResolvers: TokenTransferResolvers
  let vmEngine: VmEngineService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TokenTransferResolvers,
        EthService,
        {
          provide: TokenTransferService,
          useValue: mockService
        },
        {
          provide: VmEngineService,
          useValue: mockVmEngine
        }
      ]
    }).compile()
    tokenTransferService = module.get<TokenTransferService>(TokenTransferService)
    tokenTransferResolvers = module.get<TokenTransferResolvers>(TokenTransferResolvers)
    vmEngine = module.get<VmEngineService>(VmEngineService)
  })

  const tokenHash = '0000000000000000000000000000000000000000'
  const holderHash = '0000000000000000000000000000000000000001'
  const transactionHash = '0x0000000000000000000000000000000000000000000000000000000000000000'

  describe('addressTokenTransfers', () => {
    it('should return an array of TokenTransferDto instances matching the address hash provided', async () => {
      const result = { id: { hash: tokenHash } }

      jest.spyOn(tokenTransferService, 'findAddressTokenTransfers').mockImplementation(
        () =>
          new Promise(resolve => {
            resolve([new TokenTransferEntity(result)])
          })
      )

      expect(await tokenTransferResolvers.addressTokenTransfers(tokenHash)).toEqual([new TokenTransferDto(result)])
    })
  })

  describe('addressTokenTransfersByHolder', () => {
    it('should return an array of TokenTransferDto instances matching the token address hash and holder address hash provided', async () => {
      const result = { id: { hash: tokenHash } }

      jest.spyOn(tokenTransferService, 'findAddressTokenTransfersByHolder').mockImplementation(
        () =>
          new Promise(resolve => {
            resolve([new TokenTransferEntity(result)])
          })
      )

      expect(await tokenTransferResolvers.addressTokenTransfersByHolder(tokenHash, holderHash)).toEqual([new TokenTransferDto(result)])
    })
  })

  describe('tokenHistory', () => {
    it('should return an array of EthplorerTokenOperationDto instances matching the token address hash provided', async () => {
      const result = { transactionHash, tokenInfo: { address: tokenHash } }

      jest.spyOn(tokenTransferService, 'fetchTokenHistory').mockImplementation(
        () =>
          new Promise(resolve => {
            resolve([new EthplorerTokenOperationDto(result)])
          })
      )

      expect(await tokenTransferResolvers.tokenHistory(tokenHash)).toEqual([new EthplorerTokenOperationDto(result)])
    })
  })

  describe('topTokenHolders', () => {
    it('should return an array of EthplorerTokenHolderDto instances matching the token address hash provided', async () => {
      const result = { address: holderHash }

      jest.spyOn(tokenTransferService, 'fetchTokenHolders').mockImplementation(
        () =>
          new Promise(resolve => {
            resolve([new EthplorerTokenHolderDto(result)])
          })
      )

      expect(await tokenTransferResolvers.topTokenHolders(tokenHash)).toEqual([new EthplorerTokenHolderDto(result)])
    })
  })

  describe('holderDetails', () => {
    it('should return an instance of EthplorerAddressInfoDto matching the token address hash and holder address hash provided', async () => {
      const result = { address: holderHash }

      jest.spyOn(tokenTransferService, 'fetchAddressInfo').mockImplementation(
        () =>
          new Promise(resolve => {
            resolve(new EthplorerAddressInfoDto(result))
          })
      )

      expect(await tokenTransferResolvers.holderDetails(tokenHash, holderHash)).toEqual(new EthplorerAddressInfoDto(result))
    })
  })

  describe('holderTransfers', () => {
    it('should return an array of EthplorerTokenOperationDto instances matching the token address hash and holder address hash provided', async () => {
      const result = { transactionHash, tokenInfo: { address: tokenHash } }

      jest.spyOn(tokenTransferService, 'fetchAddressHistory').mockImplementation(
        () =>
          new Promise(resolve => {
            resolve([new EthplorerTokenOperationDto(result)])
          })
      )

      expect(await tokenTransferResolvers.holderTransfers(tokenHash, holderHash)).toEqual([new EthplorerTokenOperationDto(result)])
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

      expect(await tokenTransferResolvers.addressAllTokensOwned(tokenHash)).toEqual([new TokenDto(result)])
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

      expect(await tokenTransferResolvers.addressAmountTokensOwned(holderHash)).toEqual(100)
    })
  })
})
