import { BlockRewardEntity } from '@app/orm/entities/block-reward.entity';
import { TransactionEntity } from '@app/orm/entities/transaction.entity';
import { UncleEntity } from '@app/orm/entities/uncle.entity';
import { assignClean } from '@app/shared/utils';
import {Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn} from 'typeorm'
import { BigNumber } from 'bignumber.js';
import { BigNumberTransformer } from '../transformers/big-number.transformer';
import {BlockTimeEntity} from '@app/orm/entities/block-time.entity'

@Entity('canonical_block_header')
export class BlockHeaderEntity {

  constructor(data: any) {
    assignClean(this, data);
  }

  @PrimaryColumn({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  number!: BigNumber

  @Column({ type: 'character', length: 66, unique: true, readonly: true })
  hash!: string

  @Column({ type: 'character', length: 66, unique: true })
  parentHash!: string

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  nonce?: BigNumber

  @Column({ type: 'character', length: 66, readonly: true })
  sha3Uncles!: string

  @Column({ type: 'character', length: 514, readonly: true })
  logsBloom!: string

  @Column({ type: 'character', length: 66, readonly: true })
  transactionsRoot!: string

  @Column({ type: 'character', length: 66, readonly: true })
  stateRoot!: string

  @Column({ type: 'character', length: 66, readonly: true })
  receiptsRoot!: string

  @Column({ type: 'character', length: 66, readonly: true })
  author!: string

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  difficulty!: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  totalDifficulty!: BigNumber

  @Column({ type: 'text', readonly: true })
  extraData?: string

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  gasLimit!: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  gasUsed!: BigNumber

  @Column({ type: 'timestamp', readonly: true })
  timestamp!: Date

  @Column({ type: 'text', readonly: true })
  uncleHashes!: string

  @Column({ type: 'text', readonly: true })
  transactionHashes!: string

  @Column({ type: 'int', readonly: true })
  size!: number

  @Column({ type: 'int', readonly: true })
  blockTime?: number

  @OneToMany(type => TransactionEntity, tx => tx.blockHeader)
  @JoinColumn({
    name: 'hash',
    referencedColumnName: 'blockHash',
  })
  txs?: TransactionEntity[]

  @OneToMany(type => UncleEntity, uncle => uncle.blockHeader)
  @JoinColumn({
    name: 'hash',
    referencedColumnName: 'nephewHash',
  })
  uncles?: UncleEntity[]

  @OneToMany(type => BlockRewardEntity, reward => reward.blockHeader)
  @JoinColumn({
    name: 'hash',
    referencedColumnName: 'blockHash',
  })
  rewards?: BlockRewardEntity[]

}
