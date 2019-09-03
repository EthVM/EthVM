import {Column, PrimaryColumn} from 'typeorm';
import {BigNumberTransformer} from '@app/orm/transformers/big-number.transformer';
import {BigNumber} from 'bignumber.js';
import {assignClean} from '@app/shared/utils';

export abstract class GenericCountEntity {

  public constructor(data: any) {
    assignClean(this, data)
  }

  @PrimaryColumn({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  blockNumber!: BigNumber

  @Column({ type: 'bigint', readonly: true, transformer: new BigNumberTransformer() })
  count!: BigNumber
}
