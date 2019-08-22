import { CoinExchangeRateEntity } from '@app/orm/entities/coin-exchange-rate.entity'
import { ContractEntity } from '@app/orm/entities/contract.entity'
import { Erc20BalanceEntity } from '@app/orm/entities/erc20-balance.entity'
import { Erc721BalanceEntity } from '@app/orm/entities/erc721-balance.entity'
import { Erc20MetadataEntity } from '@app/orm/entities/erc20-metadata.entity'
import { Erc721MetadataEntity } from '@app/orm/entities/erc721-metadata.entity'
import { TokenExchangeRateEntity } from '@app/orm/entities/token-exchange-rate.entity'
import { Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { Any, EntityManager, FindManyOptions, FindOneOptions, Repository } from 'typeorm'
import BigNumber from 'bignumber.js'
import { DbConnection } from '@app/orm/config'
import { TokenMetadataEntity } from '@app/orm/entities/token-metadata.entity'
import { TokenDetailEntity } from '@app/orm/entities/token-detail.entity'
import has = Reflect.has

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Erc20BalanceEntity, DbConnection.Principal)
    private readonly erc20BalanceRepository: Repository<Erc20BalanceEntity>,
    @InjectRepository(Erc721BalanceEntity, DbConnection.Principal)
    private readonly erc721BalanceRepository: Repository<Erc721BalanceEntity>,
    @InjectRepository(Erc20MetadataEntity, DbConnection.Principal)
    private readonly erc20MetadataRepository: Repository<Erc20MetadataEntity>,
    @InjectRepository(Erc721MetadataEntity, DbConnection.Principal)
    private readonly erc721MetadataRepository: Repository<Erc721MetadataEntity>,
    @InjectRepository(TokenExchangeRateEntity, DbConnection.Principal)
    private readonly tokenExchangeRateRepository: Repository<TokenExchangeRateEntity>,
    @InjectRepository(ContractEntity, DbConnection.Principal)
    private readonly contractRepository: Repository<ContractEntity>,
    @InjectRepository(CoinExchangeRateEntity, DbConnection.Principal)
    private readonly coinExchangeRateRepository: Repository<CoinExchangeRateEntity>,
    @InjectRepository(TokenMetadataEntity, DbConnection.Principal)
    private readonly tokenMetadataRepository: Repository<TokenMetadataEntity>,
    @InjectRepository(TokenDetailEntity, DbConnection.Principal)
    private readonly tokenDetailRepository: Repository<TokenDetailEntity>,
    @InjectEntityManager(DbConnection.Principal) private readonly entityManager: EntityManager,
  ) {}

  async findTokenHolders(address: string, limit: number = 10, offset: number = 0): Promise<[Erc20BalanceEntity[] | Erc721BalanceEntity[], boolean]> {
    const findOptions: FindManyOptions = {
      where: { contract: address },
      take: limit + 1,
      skip: offset,
      cache: true,
    }
    const findOptionsErc20: FindManyOptions = { ...findOptions, select: ['address', 'amount'] }

    // Currently only erc20 tokens are displayed in explorer
    const erc20Balances = await this.erc20BalanceRepository.find(findOptionsErc20)
    const hasMore = erc20Balances.length > limit
    if (hasMore) {
      erc20Balances.pop()
    }

    return [erc20Balances, hasMore]
    // return await this.erc721BalanceRepository.findAndCount(findOptions)
  }

  async findTokenHolder(tokenAddress: string, holderAddress: string): Promise<Erc20BalanceEntity | Erc721BalanceEntity | undefined> {
    const where = { contract: tokenAddress, address: holderAddress }
    const erc20Balance = await this.erc20BalanceRepository.findOne({ where, cache: true })
    if (erc20Balance) return erc20Balance
    return this.erc721BalanceRepository.findOne({ where })
  }

  async findAddressAllErc20TokensOwned(address: string, offset: number = 0, limit: number = 10): Promise<[Erc20BalanceEntity[], boolean]> {

    return this.entityManager.transaction('READ COMMITTED', async (txn): Promise<[Erc20BalanceEntity[], boolean]> => {

      const entities = await txn.createQueryBuilder(Erc20BalanceEntity, 'b')
        .where('b.address = :address')
        .andWhere('b.amount != :amount')
        .setParameters({ address, amount: 0 })
        .cache(true)
        .leftJoinAndSelect('b.tokenExchangeRate', 'ter')
        .leftJoinAndSelect('b.metadata', 'm')
        .leftJoinAndSelect('b.contractMetadata', 'cm')
        .offset(offset)
        .limit(limit + 1)
        .getMany()

      const hasMore = entities.length > limit
      if (hasMore) {
        entities.pop() // Remove last item if extra item was retrieved
      }

      return [entities, hasMore]

    })
  }

  async findCoinExchangeRate(pair: string): Promise<CoinExchangeRateEntity | undefined> {
    const findOptions: FindOneOptions = {
      where: { id: pair },
      cache: true,
    }
    return this.coinExchangeRateRepository.findOne(findOptions)
  }

  async findTokenExchangeRates(
    sort: string = 'market_cap_rank',
    limit: number = 10,
    offset: number = 0,
    addresses: string[] = [],
  ): Promise<[TokenExchangeRateEntity[], number]> {
    let order
    switch (sort) {
      case 'price_high':
        order = { currentPrice: -1 }
        break
      case 'price_low':
        order = { currentPrice: 1 }
        break
      case 'volume_high':
        order = { totalVolume: -1 }
        break
      case 'volume_low':
        order = { totalVolume: 1 }
        break
      case 'market_cap_high':
        order = { marketCap: -1 }
        break
      case 'market_cap_low':
        order = { marketCap: 1 }
        break
      case 'market_cap_rank':
      default:
        order = { marketCapRank: 1 }
        break
    }

    const findOptions: FindManyOptions = {
      order,
      take: limit,
      skip: offset,
      cache: true,
    }

    if (addresses.length) {
      findOptions.where = {address: Any(addresses)}
    }

    const items = await this.tokenExchangeRateRepository.find(findOptions)
    const totalCount = await this.tokenExchangeRateRepository.count({ cache: true, where: findOptions.where })

    return [items, totalCount]
  }

  async countTokenExchangeRates(): Promise<number> {
    return this.tokenExchangeRateRepository.count({ cache: true })
  }

  async findTokenExchangeRateBySymbol(symbol: string): Promise<TokenExchangeRateEntity | undefined> {
    return this.tokenExchangeRateRepository.findOne({ where: { symbol }, cache: true })
  }

  async findTokenExchangeRateByAddress(address: string): Promise<TokenExchangeRateEntity | undefined> {
    return this.tokenExchangeRateRepository.findOne({
      where: { address },
      relations: ['contract', 'contract.metadata'],
      cache: true,
    })
  }

  async countTokenHolders(address: string): Promise<number> {
    let { count: numHolders } = await this.erc20BalanceRepository.createQueryBuilder('b')
      .select('COUNT(*)', 'count')
      .where('b.contract = :address', { address })
      .andWhere('b.amount > 0')
      .cache(true)
      .getRawOne()

    if (!numHolders || numHolders === 0) {
      const { count } = await this.erc721BalanceRepository.createQueryBuilder('b')
        .select('COUNT(*)', 'count')
        .where('b.contract = :address', { address })
        .cache(true)
        .getRawOne()
      numHolders = count
    }
    return numHolders
  }

  async totalValueUSDByAddress(address: string): Promise<BigNumber | undefined> {

    // Only for erc20Tokens as these have fungible value
    const raw = await this.erc20BalanceRepository
      .createQueryBuilder('erc20')
      .leftJoin('erc20.tokenExchangeRate', 'ter')
      .select('SUM(erc20.amount * ter.currentPrice)', 'usdValue')
      .where('erc20.address = :address', { address })
      .andWhere('ter.currentPrice IS NOT NULL')
      .groupBy('erc20.address')
      .getRawOne()

    return raw && raw.usdValue ? new BigNumber(raw.usdValue) : undefined

  }

  async findTokensMetadata(
    addresses: string[] = [],
    offset: number = 0,
    limit: number = 20,
  ): Promise<[TokenMetadataEntity[], boolean]> {

    const findOptions: FindManyOptions = {
      take: limit + 1,
      skip: offset,
      cache: true,
    }

    if (addresses.length) {
      findOptions.where = { address: Any(addresses) }
    }

    const items = await this.tokenMetadataRepository.find(findOptions)
    const hasMore = items.length > limit
    if (hasMore) {
      items.pop()
    }

    return [items, hasMore]
  }

  async findDetailByAddress(address: string): Promise<TokenDetailEntity | undefined> {
    return this.tokenDetailRepository.findOne({ where: { address }, cache: true })
  }
}
