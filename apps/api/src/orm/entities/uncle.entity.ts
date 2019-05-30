import { BlockHeaderEntity } from '@app/orm/entities/block-header.entity';
import { assignClean } from '@app/shared/utils';
import BigNumber from 'bignumber.js';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Column } from 'typeorm/decorator/columns/Column';
import { BigNumberTransformer } from '../transformers/big-number.transformer';

@Entity('canonical_uncle')
export class UncleEntity {

  constructor(data: any) {
    assignClean(this, data)
  }

  @PrimaryColumn({ type: 'character', length: 66, readonly: true })
  hash!: string

  @Column({ type: 'integer', readonly: true })
  index!: number

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  nephewNumber!: BigNumber

  @Column({ type: 'character', length: 66, readonly: true })
  nephewHash!: string

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  number!: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  height!: BigNumber

  @Column({ type: 'character', length: 66, readonly: true })
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

  @Column({ type: 'character', length: 42, readonly: true })
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

  @Column({ type: 'bigint', readonly: true })
  size!: string

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  rewardAmount?: BigNumber

  @ManyToOne(type => BlockHeaderEntity, block => block.uncles)
  @JoinColumn({
    name: 'nephewHash',
    referencedColumnName: 'hash',
  })
  blockHeader!: BlockHeaderEntity

}
