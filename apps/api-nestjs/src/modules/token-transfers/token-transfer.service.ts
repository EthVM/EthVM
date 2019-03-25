import { EthplorerAddressInfoDto } from '@app/modules/token-transfers/dto/ethplorer-address-info.dto'
import { EthplorerTokenHolderDto } from '@app/modules/token-transfers/dto/ethplorer-token-holder.dto'
import { EthplorerTokenOperationDto } from '@app/modules/token-transfers/dto/ethplorer-token-operation.dto'
import { TokenTransferEntity } from '@app/orm/entities/token-transfer.entity'
import { ConfigService } from '@app/shared/config.service'
import { HttpException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import axios from 'axios'
import { MongoRepository } from 'typeorm'

@Injectable()
export class TokenTransferService {
  constructor(
    @InjectRepository(TokenTransferEntity)
    private readonly tokenTransferRepository: MongoRepository<TokenTransferEntity>,
    private readonly configService: ConfigService
  ) {}

  async findAddressTokenTransfers(address: string, take: number = 10, page: number = 0): Promise<TokenTransferEntity[]> {
    const skip = take * page
    return this.tokenTransferRepository.find({
      where: { contract: address, transferType: { $not: { $eq: 'ETHER' } } },
      take,
      skip,
      order: { timestamp: -1 }
    })
  }

  async findAddressTokenTransfersByHolder(
    address: string,
    holder: string,
    filter: string = 'all',
    take: number = 10,
    page: number = 0
  ): Promise<TokenTransferEntity[]> {
    const skip = take * page
    let where
    switch (filter) {
      case 'in':
        where = { contract: address, transferType: { $not: { $eq: 'ETHER' } }, from: holder }
        break
      case 'out':
        where = { contract: address, transferType: { $not: { $eq: 'ETHER' } }, to: holder }
        break
      default:
        where = { contract: address, transferType: { $not: { $eq: 'ETHER' } }, $or: [{ from: holder }, { to: holder }] }
        break
    }
    return this.tokenTransferRepository.find({ where, take, skip, order: { timestamp: -1 } })
  }

  async fetchTokenHistory(address: string): Promise<EthplorerTokenOperationDto[]> {
    address = `0x${address}`

    const baseUrl = this.configService.ethplorer.url
    const apiKey = this.configService.ethplorer.apiKey
    const url = `${baseUrl}getTokenHistory/${address}?apiKey=${apiKey}&type=transfer&limit=10`

    let res

    try {
      res = await axios.get(url)
    } catch (err) {
      this.handleEthplorerError(err)
    }

    if (res.status !== 200) {
      throw new HttpException(res.statusText, res.status)
    }

    const { operations } = res.data

    return operations ? operations.map(o => new EthplorerTokenOperationDto(o)) : []
  }

  async fetchTokenHolders(address: string): Promise<EthplorerTokenHolderDto[]> {
    address = `0x${address}`

    const baseUrl = this.configService.ethplorer.url
    const apiKey = this.configService.ethplorer.apiKey
    const url = `${baseUrl}getTopTokenHolders/${address}?apiKey=${apiKey}`

    let res

    try {
      res = await axios.get(url)
    } catch (err) {
      this.handleEthplorerError(err)
    }

    if (res.status !== 200) {
      throw new HttpException(res.statusText, res.status)
    }

    const { holders } = res.data

    return holders ? holders.map(h => new EthplorerTokenHolderDto(h)) : []
  }

  async fetchAddressInfo(tokenAddress: string, holderAddress: string): Promise<EthplorerAddressInfoDto | null> {
    tokenAddress = `0x${tokenAddress}`
    holderAddress = `0x${holderAddress}`

    const baseUrl = this.configService.ethplorer.url
    const apiKey = this.configService.ethplorer.apiKey
    const url = `${baseUrl}getAddressInfo/${holderAddress}?apiKey=${apiKey}&token=${tokenAddress}`

    let res

    try {
      res = await axios.get(url)
    } catch (err) {
      this.handleEthplorerError(err)
    }

    if (res.status !== 200) {
      throw new HttpException(res.statusText, res.status)
    }

    const { data } = res

    return data ? new EthplorerAddressInfoDto(data) : null
  }

  async fetchAddressHistory(tokenAddress: string, holderAddress: string): Promise<EthplorerTokenOperationDto[]> {
    tokenAddress = `0x${tokenAddress}`
    holderAddress = `0x${holderAddress}`

    const baseUrl = this.configService.ethplorer.url
    const apiKey = this.configService.ethplorer.apiKey
    const url = `${baseUrl}getAddressHistory/${holderAddress}?apiKey=${apiKey}&token=${tokenAddress}&type=transfer`

    let res

    try {
      res = await axios.get(url)
    } catch (err) {
      this.handleEthplorerError(err)
    }

    if (res.status !== 200) {
      throw new HttpException(res.statusText, res.status)
    }

    const { operations } = res.data

    return operations.map(o => new EthplorerTokenOperationDto(o))
  }

  private handleEthplorerError(err) {
    if (err.response.data && err.response.data.error) {
      throw new HttpException(err.response.data.error.message, err.response.status)
    }
    throw err
  }
}
