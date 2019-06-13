import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'
import { TransactionEntity } from '@app/orm/entities/transaction.entity'
import { BigNumberTransformer } from '../transformers/big-number.transformer';
import BigNumber from 'bignumber.js';

@Entity('canonical_transaction_receipt')
export class TransactionReceiptEntity {

  constructor(data: any) {
    assignClean(this, data);
  }

  @PrimaryColumn({type: 'character', length: 66, readonly: true})
  transactionHash!: string

  @Column({type: 'integer', readonly: true})
  transactionIndex!: number

  @Column({type: 'character', length: 66, readonly: true})
  blockHash!: string

  @Column({type: 'numeric', readonly: true})
  blockNumber!: string

  @Column({type: 'character', length: 66, readonly: true})
  from!: string

  @Column({type: 'character', length: 66, readonly: true})
  to?: string

  @Column({type: 'character', length: 66, readonly: true})
  contractAddress?: string

  @Column({type: 'numeric', readonly: true, transformer: new BigNumberTransformer()})
  cumulativeGasUsed!: BigNumber

  @Column({type: 'numeric', readonly: true, transformer: new BigNumberTransformer()})
  gasUsed!: BigNumber

  @Column({type: 'text', readonly: true})
  logs!: string

  @Column({type: 'character', length: 514, readonly: true})
  logsBloom!: string

  @Column({type: 'character', length: 66, readonly: true})
  root?: string

  @Column({type: 'numeric', readonly: true, transformer: new BigNumberTransformer()})
  status?: BigNumber

  @OneToOne(type => TransactionEntity, tx => tx.receipt)
  @JoinColumn({
    name: 'transactionHash',
    referencedColumnName: 'transactionHash',
  })
  tx!: TransactionEntity

}
