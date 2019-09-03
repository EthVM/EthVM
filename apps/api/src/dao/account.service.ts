import {Injectable} from '@nestjs/common'
import {Repository, In, LessThanOrEqual} from 'typeorm'
import {InjectRepository} from '@nestjs/typeorm'
import BigNumber from 'bignumber.js';
import {ContractEntity} from '@app/orm/entities/contract.entity';
import {BalanceDeltaEntity} from '@app/orm/entities/balance-delta.entity';
import {BalanceEntity} from '@app/orm/entities/balance.entity';
import {BlockHeaderEntity} from '@app/orm/entities/block-header.entity';
import {AddressTransactionCountEntity} from '@app/orm/entities/address-transaction-count.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(ContractEntity)
    private readonly contractRepository: Repository<ContractEntity>,
    @InjectRepository(BalanceDeltaEntity)
    private readonly balanceDeltaRepository: Repository<BalanceDeltaEntity>,
    @InjectRepository(BalanceEntity)
    private readonly balanceRepository: Repository<BalanceEntity>,
    @InjectRepository(BlockHeaderEntity)
    private readonly blockHeaderRepository: Repository<BlockHeaderEntity>,
    @InjectRepository(AddressTransactionCountEntity)
    private readonly txCountsRepository: Repository<AddressTransactionCountEntity>,
  ) {
  }

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

  async findIsMiner(address: string, blockNumber: BigNumber): Promise<boolean> {
    const header = await this.blockHeaderRepository.findOne({
      select: ['number'],
      where: {
        author: address,
        number: LessThanOrEqual(blockNumber),
      },
      cache: true,
    })

    return !!header
  }

  async findIsContractCreator(address: string, blockNumber: BigNumber): Promise<boolean> {
    const contract = await this.contractRepository.findOne({
      select: ['creator'],
      where: {
        creator: address,
        createdAtBlockNumber: LessThanOrEqual(blockNumber),
      },
      cache: true,
    })

    return !!contract
  }

  async findHasInternalTransfers(address: string, blockNumber: BigNumber): Promise<boolean> {
    const transfer = await this.balanceDeltaRepository.findOne({
      select: ['id'],
      where: {
        address,
        deltaType: In(['INTERNAL_TX', 'CONTRACT_CREATION', 'CONTRACT_DESTRUCTION']),
        blockNumber: LessThanOrEqual(blockNumber),
      },
      cache: true,
    })

    return !!transfer

  }

  async findIsContract(address: string, blockNumber: BigNumber): Promise<boolean> {
    const contract = await this.contractRepository.findOne({
      select: ['creator'],
      where: {address, createdAtBlockNumber: LessThanOrEqual(blockNumber)},
      cache: true,
    })

    return !!contract
  }
}
