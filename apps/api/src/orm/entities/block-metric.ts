import {Column, PrimaryColumn} from "typeorm";

export abstract class BlockMetric {

  @PrimaryColumn({type: 'bigint', readonly: true})
  timestamp!: string

  @Column({type: 'bigint', readonly: true})
  blockCount!: string

  @Column({type: 'numeric', readonly: true})
  maxDifficulty!: string

  @Column({type: 'numeric', readonly: true})
  avgDifficulty!: string

  @Column({type: 'numeric', readonly: true})
  minDifficulty!: string

  @Column({type: 'numeric', readonly: true})
  sumDifficulty!: string

  @Column({type: 'bigint', readonly: true})
  txCount!: string

  @Column({type: 'numeric', readonly: true})
  maxTotalGasPrice!: string

  @Column({type: 'numeric', readonly: true})
  minTotalGasPrice!: string

  @Column({type: 'numeric', readonly: true})
  avgTotalGasPrice!: string

  @Column({type: 'numeric', readonly: true})
  sumTotalGasPrice!: string

  @Column({type: 'numeric', readonly: true})
  maxAvgGasLimit!: string

  @Column({type: 'numeric', readonly: true})
  minAvgGasLimit!: string

  @Column({type: 'numeric', readonly: true})
  avgAvgGasLimit!: string

  @Column({type: 'numeric', readonly: true})
  sumAvgGasLimit!: string

  @Column({type: 'numeric', readonly: true})
  maxAvgGasPrice!: string

  @Column({type: 'numeric', readonly: true})
  minAvgGasPrice!: string

  @Column({type: 'numeric', readonly: true})
  avgAvgGasPrice!: string

  @Column({type: 'numeric', readonly: true})
  sumAvgGasPrice!: string

  @Column({type: 'numeric', readonly: true})
  maxTotalTxFees!: string

  @Column({type: 'numeric', readonly: true})
  minTotalTxFees!: string

  @Column({type: 'numeric', readonly: true})
  avgTotalTxFees!: string

  @Column({type: 'numeric', readonly: true})
  sumTotalTxFees!: string

  @Column({type: 'numeric', readonly: true})
  maxAvgTxFees!: string

  @Column({type: 'numeric', readonly: true})
  minAvgTxFees!: string

  @Column({type: 'numeric', readonly: true})
  avgAvgTxFees!: string

  @Column({type: 'numeric', readonly: true})
  sumAvgTxFees!: string

  @Column({type: 'bigint', readonly: true})
  traceCount!: string

  @Column({type: 'integer', readonly: true})
  maxTotalTxs!: number

  @Column({type: 'integer', readonly: true})
  minTotalTxs!: number

  @Column({type: 'numeric', readonly: true})
  avgTotalTxs!: string

  @Column({type: 'bigint', readonly: true})
  sumTotalTxs!: string

  @Column({type: 'integer', readonly: true})
  maxNumSuccessfulTxs!: number

  @Column({type: 'integer', readonly: true})
  minNumSuccessfulTxs!: number

  @Column({type: 'numeric', readonly: true})
  avgNumSuccessfulTxs!: string

  @Column({type: 'bigint', readonly: true})
  sumNumSuccessfulTxs!: string

  @Column({type: 'integer', readonly: true})
  maxNumFailedTxs!: number

  @Column({type: 'integer', readonly: true})
  minNumFailedTxs!: number

  @Column({type: 'numeric', readonly: true})
  avgNumFailedTxs!: string

  @Column({type: 'bigint', readonly: true})
  sumNumFailedTxs!: string

  @Column({type: 'integer', readonly: true})
  maxNumInternalTxs!: number

  @Column({type: 'integer', readonly: true})
  minNumInternalTxs!: number

  @Column({type: 'numeric', readonly: true})
  avgNumInternalTxs!: string

  @Column({type: 'bigint', readonly: true})
  sumNumInternalTxs!: string

}
