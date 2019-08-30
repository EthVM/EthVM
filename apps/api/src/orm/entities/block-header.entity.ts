import {assignClean} from '@app/shared/utils'
import {Column, Entity, PrimaryColumn, OneToMany, JoinColumn} from 'typeorm'
import {BigNumber} from 'bignumber.js'
import {BigNumberTransformer} from '../transformers/big-number.transformer'
import {DateTransformer} from '@app/orm/transformers/date.transformer'
import {UncleEntity} from '@app/orm/entities/uncle.entity'
import {BlockRewardEntity} from '@app/orm/entities/block-reward.entity'

@Entity('block_header')
export class BlockHeaderEntity {

  constructor(data: any) {
    assignClean(this, data);
  }

  @PrimaryColumn({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  number!: BigNumber

  @Column({ type: 'char', length: 66, unique: true, readonly: true })
  hash!: string

  @Column({ type: 'char', length: 66, unique: true })
  parentHash!: string

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  nonce?: BigNumber

  @Column({ type: 'char', length: 66, readonly: true })
  sha3Uncles!: string

  @Column({ type: 'char', length: 514, readonly: true })
  logsBloom!: string

  @Column({ type: 'char', length: 66, readonly: true })
  transactionsRoot!: string

  @Column({ type: 'char', length: 66, readonly: true })
  stateRoot!: string

  @Column({ type: 'char', length: 66, readonly: true })
  receiptsRoot!: string

  @Column({ type: 'char', length: 42, readonly: true })
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

  @Column({ type: 'timestamp', readonly: true, transformer: new DateTransformer() })
  timestamp!: Date

  @Column({ type: 'int', readonly: true })
  blockTime?: number

  @Column({ type: 'int', readonly: true })
  size!: number

  @Column({ type: 'int', readonly: true })
  uncleCount!: number

  @Column({ type: 'text', readonly: true })
  uncleHashes!: string

  @Column({ type: 'int', readonly: true })
  transactionCount!: number

  @Column({ type: 'text', readonly: true })
  transactionHashes!: string

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
