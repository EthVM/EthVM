import {Column, Entity, PrimaryColumn} from 'typeorm'
import {BigNumberTransformer} from '@app/orm/transformers/big-number.transformer';
import {BigNumber} from 'bignumber.js';
import {assignClean} from '@app/shared/utils';

@Entity('address_contracts_created_count')
export class AddressContractsCreatedCountEntity {

  public constructor(data: any) {
    assignClean(this, data)
  }

  @PrimaryColumn({ type: 'char', length: 42, readonly: true })
  address!: string

  @PrimaryColumn({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  blockNumber!: BigNumber

  @Column({ type: 'bigint', readonly: true, transformer: new BigNumberTransformer() })
  total!: BigNumber

}
