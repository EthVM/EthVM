import {assignClean} from '@app/shared/utils';
import {Column, PrimaryColumn} from 'typeorm';
import {BigNumberTransformer} from '@app/orm/transformers/big-number.transformer';
import {BigNumber} from 'bignumber.js';

export abstract class TxCountEntity {

  public constructor(data: any) {
    assignClean(this, data)
  }

  @PrimaryColumn({ type: 'char', length: 42, readonly: true })
  address!: string

  @PrimaryColumn({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  blockNumber!: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  total!: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  totalOut!: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  totalIn!: BigNumber
}
