import {Injectable} from '@nestjs/common'
import {EntityManager, LessThanOrEqual, Repository} from 'typeorm'
import {InjectEntityManager, InjectRepository} from '@nestjs/typeorm'
import BigNumber from 'bignumber.js';
import {ContractEntity} from '@app/orm/entities/contract.entity';
import {BalanceEntity} from '@app/orm/entities/balance.entity';
import {AddressTransactionCountEntity} from '@app/orm/entities/address-transaction-count.entity';
import {MinerBlockCountEntity} from '@app/orm/entities/miner-block-count.entity';
import {AddressContractsCreatedCountEntity} from '@app/orm/entities/address-contracts-created-count.entity';
import {AddressInternalTransactionCountEntity} from '@app/orm/entities/address-internal-transaction-count.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(ContractEntity)
    private readonly contractRepository: Repository<ContractEntity>,
    @InjectRepository(BalanceEntity)
    private readonly balanceRepository: Repository<BalanceEntity>,
    @InjectRepository(AddressTransactionCountEntity)
    private readonly txCountsRepository: Repository<AddressTransactionCountEntity>,
  ) {
  }

  /**
   * Find an ether balance for a given address.
   * @param {string} address - The address hash to search by.
   * @param {BigNumber} blockNumber - Balance entries after this block number will be ignored.
   * @returns {Promise<BalanceEntity | undefined>}
   */
  async findEtherBalanceByAddress(address: string, blockNumber: BigNumber): Promise<BalanceEntity | undefined> {
    return this.balanceRepository.findOne({
      where: {
        address,
        blockNumber: LessThanOrEqual(blockNumber),
        tokenType: 'ETHER',
      },
      order: {
        blockNumber: 'DESC',
      },
      cache: true,
    })
  }

  /**
   * Find transaction counts for a given address.
   * @param {string} address - The address hash to search by.
   * @param {BigNumber} blockNumber - Transaction count entries after this block number will be ignored.
   * @returns {Promise<AddressTransactionCountEntity | undefined>}
   */
  async findTransactionCounts(address: string, blockNumber: BigNumber): Promise<AddressTransactionCountEntity | undefined> {
    return this.txCountsRepository.findOne({
      where: {
        address,
        blockNumber: LessThanOrEqual(blockNumber),
      },
      order: {
        blockNumber: 'DESC',
      },
      cache: true,
    })
  }

  /**
   * Find whether an address is a miner.
   * @param {string} address - The address hash to search by.
   * @param {BigNumber} blockNumber - Blocks mined after this block number will be ignored.
   * @returns {Promise<boolean>}
   */
  async findIsMiner(address: string, blockNumber: BigNumber): Promise<boolean> {
    const header = await this.entityManager.findOne(MinerBlockCountEntity, {
      select: ['count'],
      where: {
        author: address,
        number: LessThanOrEqual(blockNumber),
      },
      cache: true,
    })
    return !!header
  }

  /**
   * Find whether an address has created any contracts.
   * @param {string} address - The address hash to search by.
   * @param {BigNumber} blockNumber - Contracts created after this block number will be ignored.
   * @returns {Promise<boolean>}
   */
  async findIsContractCreator(address: string, blockNumber: BigNumber): Promise<boolean> {
    const contract = await this.entityManager.findOne(AddressContractsCreatedCountEntity, {
      select: ['count'],
      where: {
        address,
        blockNumber: LessThanOrEqual(blockNumber),
      },
      cache: true,
    })
    return !!contract
  }

  /**
   * Find whether an address has been part of any internal transactions.
   * @param {string} address - The address hash to search by.
   * @param {BigNumber} blockNumber - Internal transactions after this block number will be ignored.
   * @returns {Promise<boolean>}
   */
  async findHasInternalTransfers(address: string, blockNumber: BigNumber): Promise<boolean> {
    const count = await this.entityManager.findOne(AddressInternalTransactionCountEntity, {
      select: ['total'],
      where: { address, blockNumber: LessThanOrEqual(blockNumber) },
      cache: true,
    })
    return !!count
  }

  /**
   * Find whether an address is a contract.
   * @param {string} address - The address hash to search by.
   * @param {BigNumber} blockNumber - Contracts created after this block number will be ignored.
   * @returns {Promise<boolean>}
   */
  async findIsContract(address: string, blockNumber: BigNumber): Promise<boolean> {
    const contract = await this.contractRepository.findOne({
      select: ['creator'],
      where: {address, createdAtBlockNumber: LessThanOrEqual(blockNumber)},
      cache: true,
    })
    return !!contract
  }
}
