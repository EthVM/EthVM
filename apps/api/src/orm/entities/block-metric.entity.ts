import {BigNumber} from 'bignumber.js'
import {Column, Entity, PrimaryColumn} from 'typeorm'
import {BigNumberTransformer} from '../transformers/big-number.transformer'
import { assignClean } from '@app/shared/utils'

@Entity('canonical_block_metric')
export class BlockMetricEntity {

  constructor(data: any) {
    assignClean(this, data);
  }

  @PrimaryColumn({type: 'numeric', readonly: true, transformer: new BigNumberTransformer()})
  number!: BigNumber

  @PrimaryColumn({type: 'timestamp', readonly: true})
  timestamp!: Date

  @Column({type: 'character', length: 66, unique: true, readonly: true})
  blockHash!: string

  @Column({type: 'int', readonly: true})
  blockTime!: number

  @Column({type: 'int', readonly: true})
  numUncles!: number

  @Column({type: 'numeric', readonly: true, transformer: new BigNumberTransformer()})
  difficulty!: BigNumber

  @Column({type: 'numeric', readonly: true, transformer: new BigNumberTransformer()})
  totalDifficulty!: BigNumber

  @Column({type: 'numeric', readonly: true, transformer: new BigNumberTransformer()})
  totalGasPrice!: BigNumber

  @Column({type: 'numeric', readonly: true, transformer: new BigNumberTransformer()})
  avgGasLimit!: BigNumber

  @Column({type: 'numeric', readonly: true, transformer: new BigNumberTransformer()})
  avgGasPrice!: BigNumber

  @Column({type: 'int', readonly: true})
  totalTxs!: number

  @Column({type: 'int', readonly: true})
  numSuccessfulTxs!: number

  @Column({type: 'int', readonly: true})
  numFailedTxs!: number

  @Column({type: 'int', readonly: true})
  numInternalTxs!: number

  @Column({type: 'numeric', readonly: true, transformer: new BigNumberTransformer()})
  totalTxFees?: BigNumber

  @Column({type: 'numeric', readonly: true, transformer: new BigNumberTransformer()})
  avgTxFees?: BigNumber

}
