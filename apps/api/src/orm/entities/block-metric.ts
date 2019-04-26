import { BigNumber } from 'bignumber.js';
import { Column, PrimaryColumn } from 'typeorm';
import { BigNumberTransformer } from '../transformers/big-number.transformer';

export abstract class BlockMetric {

  @PrimaryColumn({ type: 'bigint', readonly: true })
  timestamp!: string

  @Column({ type: 'bigint', readonly: true })
  blockCount!: string

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  maxDifficulty!: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  avgDifficulty!: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  minDifficulty!: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  sumDifficulty!: BigNumber

  @Column({ type: 'bigint', readonly: true })
  txCount!: string

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  maxTotalGasPrice!: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  minTotalGasPrice!: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  avgTotalGasPrice!: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  sumTotalGasPrice!: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  maxAvgGasLimit!: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  minAvgGasLimit!: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  avgAvgGasLimit!: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  sumAvgGasLimit!: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  maxAvgGasPrice!: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  minAvgGasPrice!: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  avgAvgGasPrice!: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  sumAvgGasPrice!: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  maxTotalTxFees!: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  minTotalTxFees!: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  avgTotalTxFees!: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  sumTotalTxFees!: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  maxAvgTxFees!: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  minAvgTxFees!: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  avgAvgTxFees!: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  sumAvgTxFees!: BigNumber

  @Column({ type: 'bigint', readonly: true })
  traceCount!: string

  @Column({ type: 'integer', readonly: true })
  maxTotalTxs!: number

  @Column({ type: 'integer', readonly: true })
  minTotalTxs!: number

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  avgTotalTxs!: BigNumber

  @Column({ type: 'bigint', readonly: true })
  sumTotalTxs!: string

  @Column({ type: 'integer', readonly: true })
  maxNumSuccessfulTxs!: number

  @Column({ type: 'integer', readonly: true })
  minNumSuccessfulTxs!: number

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  avgNumSuccessfulTxs!: BigNumber

  @Column({ type: 'bigint', readonly: true })
  sumNumSuccessfulTxs!: string

  @Column({ type: 'integer', readonly: true })
  maxNumFailedTxs!: number

  @Column({ type: 'integer', readonly: true })
  minNumFailedTxs!: number

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  avgNumFailedTxs!: BigNumber

  @Column({ type: 'bigint', readonly: true })
  sumNumFailedTxs!: string

  @Column({ type: 'integer', readonly: true })
  maxNumInternalTxs!: number

  @Column({ type: 'integer', readonly: true })
  minNumInternalTxs!: number

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  avgNumInternalTxs!: BigNumber

  @Column({ type: 'bigint', readonly: true })
  sumNumInternalTxs!: string

}
