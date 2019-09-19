/* tslint:disable:no-trailing-whitespace */
import {Injectable} from '@nestjs/common'
import {InjectEntityManager, InjectRepository} from '@nestjs/typeorm'
import {Any, EntityManager, FindManyOptions, FindOneOptions, In, LessThanOrEqual, MoreThan, Repository} from 'typeorm'
import BigNumber from 'bignumber.js'
import {BalanceEntity} from '@app/orm/entities/balance.entity';
import {CoinExchangeRateEntity} from '@app/orm/entities/coin-exchange-rate.entity';
import {TokenExchangeRateEntity} from '@app/orm/entities/token-exchange-rate.entity';
import {TokenMetadataEntity} from '@app/orm/entities/token-metadata.entity';
import {TokenDetailEntity} from '@app/orm/entities/token-detail.entity';
import {ContractEntity} from '@app/orm/entities/contract.entity';
import {AddressTokenCountEntity} from '@app/orm/entities/address-token-count.entity';
import {ContractHolderCountEntity} from '@app/orm/entities/contract-holder-count.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(BalanceEntity)
    private readonly balanceRepository: Repository<BalanceEntity>,
    @InjectRepository(CoinExchangeRateEntity)
    private readonly coinExchangeRateRepository: Repository<CoinExchangeRateEntity>,
    @InjectRepository(TokenExchangeRateEntity)
    private readonly tokenExchangeRateRepository: Repository<TokenExchangeRateEntity>,
    @InjectRepository(TokenMetadataEntity)
    private readonly tokenMetadataRepository: Repository<TokenMetadataEntity>,
    @InjectRepository(TokenDetailEntity)
    private readonly tokenDetailRepository: Repository<TokenDetailEntity>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {
  }

  zeroBN = new BigNumber(0)

  async findAllTokenBalancesForContract(
    contractAddress: string,
    limit: number = 10,
    offset: number = 0,
    blockNumber: BigNumber,
  ): Promise<[BalanceEntity[], boolean, BigNumber]> {

    // TODO handle ERC721

    const erc20Count = await this.entityManager.findOne(ContractHolderCountEntity, {
      where: {contractAddress, tokenType: 'ERC20', blockNumber: LessThanOrEqual(blockNumber)},
      order: {blockNumber: 'DESC'},
      cache: true,
    })

    const count = erc20Count ? erc20Count.count : this.zeroBN
    if (count.isEqualTo(0)) {
      return [[], false, count]
    }

    const balances = await this.entityManager.query(`
      WITH _balances as (
        SELECT 
          *,
          row_number() OVER (PARTITION BY address ORDER BY block_number DESC) AS row_number
          FROM balance
          WHERE contract_address = $1          
          AND balance > 0
          AND block_number <= $2
      )
      SELECT * FROM _balances
      WHERE row_number = 1
      OFFSET $3
      LIMIT $4
    `, [contractAddress, blockNumber.toNumber(), offset, limit + 1])

    const hasMore = balances.length > limit
    if (hasMore) {
      balances.pop()
    }
    return [balances, hasMore, count]
  }

  async findTokenBalance(tokenAddress: string, holderAddress: string, blockNumber: BigNumber): Promise<BalanceEntity | undefined> {
    const where = {contract: tokenAddress, address: holderAddress, blockNumber: LessThanOrEqual(blockNumber)}
    return this.balanceRepository.findOne({where, cache: true, order: {blockNumber: 'DESC'}})
  }

  async findAllTokenBalancesForAddress(
    address: string,
    offset: number = 0,
    limit: number = 10,
    blockNumber: BigNumber,
  ): Promise<[BalanceEntity[], boolean, BigNumber]> {

    return this.entityManager.transaction('READ COMMITTED', async (txn): Promise<[BalanceEntity[], boolean, BigNumber]> => {

      const erc20Count = await txn.findOne(AddressTokenCountEntity, {
        where: {address, tokenType: 'ERC20', blockNumber: LessThanOrEqual(blockNumber)},
        order: {blockNumber: 'DESC'},
        cache: true,
      })

      const count = erc20Count ? erc20Count.count : this.zeroBN
      if (count.isEqualTo(0)) {
        return [[], false, count]
      }

      const items = await txn.query(`
      WITH _balances as (
        SELECT 
          *,
          row_number() OVER (PARTITION BY address, contract_address ORDER BY block_number DESC) AS row_number
          FROM balance
          WHERE address = $1          
          AND token_type = 'ERC20'
          AND balance > 0          
          AND block_number <= $2
      )
      SELECT * FROM _balances
      WHERE row_number = 1
      OFFSET $3
      LIMIT $4
    `, [address, blockNumber.toNumber(), offset, limit + 1])

      // Get token relations
      const contractAddresses = items.map(i => i.contract_address)
      const contracts = await txn.find(ContractEntity, {
        where: {address: In(contractAddresses), createdAtBlockNumber: LessThanOrEqual(blockNumber)},
        relations: ['ethListContractMetadata', 'contractMetadata', 'tokenExchangeRate'],
        cache: true,
      })

      // Map contracts by contractAddress
      const contractsByAddress = contracts.reduce((memo, next) => {
        memo[next.address] = next
        return memo
      }, {})

      // Map metadata to balances
      items
        .forEach(balance => {
          const {ethListContractMetadata, contractMetadata, tokenExchangeRate} = contractsByAddress[balance.contract_address]
          balance.ethListContractMetadata = ethListContractMetadata
          balance.contractMetadata = contractMetadata
          balance.tokenExchangeRate = tokenExchangeRate
        })

      const hasMore = items.length > limit
      if (hasMore) {
        items.pop() // Remove last item if extra item was retrieved
      }

      return [items, hasMore, count]

    })
  }

  async findCoinExchangeRate(pair: string): Promise<CoinExchangeRateEntity | undefined> {
    const findOptions: FindOneOptions = {
      where: {id: pair},
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
        order = {currentPrice: -1}
        break
      case 'price_low':
        order = {currentPrice: 1}
        break
      case 'volume_high':
        order = {totalVolume: -1}
        break
      case 'volume_low':
        order = {totalVolume: 1}
        break
      case 'market_cap_high':
        order = {marketCap: -1}
        break
      case 'market_cap_low':
        order = {marketCap: 1}
        break
      case 'market_cap_rank':
      default:
        order = {marketCapRank: 1}
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
    const count = await this.countTokenExchangeRates()

    return [items, count]
  }

  async countTokenExchangeRates(): Promise<number> {
    return this.tokenExchangeRateRepository.count({cache: true})
  }

  async findTokenExchangeRateBySymbol(symbol: string): Promise<TokenExchangeRateEntity | undefined> {
    return this.tokenExchangeRateRepository.findOne({where: {symbol}, cache: true})
  }

  async findTokenExchangeRateByAddress(address: string): Promise<TokenExchangeRateEntity | undefined> {
    return this.tokenExchangeRateRepository.findOne({
      where: {address},
      relations: ['contract', 'contract.contractMetadata', 'contract.ethListContractMetadata'], // TODO confirm all these relations are necessary
      cache: true,
    })
  }

  async countTokenHolders(contractAddress: string, blockNumber: BigNumber): Promise<BigNumber> {

    // Note this only works for erc20 tokens, not ERC721.
    const contractHolderCount = await this.entityManager.findOne(ContractHolderCountEntity, {
      where: {contractAddress, tokenType: 'ERC20', blockNumber: LessThanOrEqual(blockNumber)},
      order: {blockNumber: 'DESC'},
      cache: true,
    })

    return contractHolderCount ? contractHolderCount.count : this.zeroBN

  }

  async totalValueUSDByAddress(address: string, blockNumber: BigNumber): Promise<BigNumber | undefined> {

    const raw = await this.entityManager.query(`
      WITH _balances as (
        SELECT 
          b.balance AS balance,
          ter.current_price AS current_price,
          row_number() OVER (PARTITION BY b.address ORDER BY b.block_number DESC) AS row_number
          FROM balance AS b
          LEFT JOIN token_exchange_rate AS ter ON b.contract_address = ter.address
          WHERE b.address = $1
          AND b.token_id IS NULL
          AND b.balance > 0
          AND b.block_number <= $2
          AND ter.current_price IS NOT NULL
      )
      SELECT SUM(balance * current_price) FROM _balances
      WHERE row_number = 1
    `, [address, blockNumber.toNumber()])

    return raw && raw.usdValue ? new BigNumber(raw.usdValue) : undefined

  }

  async findTokenMetadata(
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
      findOptions.where = {address: Any(addresses)}
    }

    const items = await this.tokenMetadataRepository.find(findOptions)
    const hasMore = items.length > limit
    if (hasMore) {
      items.pop()
    }

    return [items, hasMore]
  }

  async findDetailByAddress(address: string, blockNumber: BigNumber): Promise<TokenDetailEntity | undefined> {
    return this.tokenDetailRepository.findOne({where: [{ address }, {  }], cache: true})
  }
}
