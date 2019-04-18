import { ConfigService } from '@app/shared/config.service'
import { HttpException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import axios from 'axios'
import { FindManyOptions, Repository } from 'typeorm'
import { VmEngineService } from '@app/shared/vm-engine.service'
import { TokenDto } from '@app/modules/tokens/dto/token.dto'
import { Erc20BalanceEntity } from '@app/orm/entities/erc20-balance.entity'
import { Erc721BalanceEntity } from '@app/orm/entities/erc721-balance.entity'
import { EthplorerTokenInfoDto } from '@app/modules/tokens/dto/ethplorer-token-info.dto'

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Erc20BalanceEntity)
    private readonly erc20BalanceRepository: Repository<Erc20BalanceEntity>,
    @InjectRepository(Erc721BalanceEntity)
    private readonly erc721BalanceRepository: Repository<Erc721BalanceEntity>,
    private readonly configService: ConfigService,
    private readonly vmEngine: VmEngineService,
  ) {}

  async findTokenHolders(address: string, limit: number = 10, page: number = 0): Promise<Erc20BalanceEntity[] | Erc721BalanceEntity[]> {
    const skip = page * limit
    const findOptions: FindManyOptions = {
      where: { contract: address },
      take: limit,
      skip,
    }
    const ercBalances = await this.erc20BalanceRepository.find(findOptions)
    if (ercBalances.length) {
      return ercBalances
    }
    return await this.erc721BalanceRepository.find(findOptions)
  }

  async findTokenHolder(tokenAddress: string, holderAddress: string): Promise<Erc20BalanceEntity | Erc721BalanceEntity | undefined> {
    const where = { contract: tokenAddress, address: holderAddress }
    const erc20Balance = await this.erc20BalanceRepository.findOne({ where })
    if (erc20Balance) return erc20Balance
    return this.erc721BalanceRepository.findOne({ where })

  }

  async fetchTokenInfo(address: string): Promise<EthplorerTokenInfoDto | null> {
    address = `0x${address}`

    const baseUrl = this.configService.ethplorer.url
    const apiKey = this.configService.ethplorer.apiKey
    const url = `${baseUrl}getTokenInfo/${address}?apiKey=${apiKey}`

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
    return data ? new EthplorerTokenInfoDto(data) : null
  }

  private handleEthplorerError(err) {
    if (err.response.data && err.response.data.error) {
      throw new HttpException(err.response.data.error.message, err.response.status)
    }
    throw err
  }

  async findAddressAllTokensOwned(address: string): Promise<TokenDto[]> {
    const tokens = await this.vmEngine.fetchAddressAllTokensOwned(address)

    for await (const token of tokens) {
      // TODO re-enable
      const rate = {currentPrice: 0} // await this.exchangeService.findTokenExchangeRateByAddress(token.addr!!.replace('0x', ''))
      token.currentPrice = rate ? rate.currentPrice : 0
    }

    return tokens
  }
}
