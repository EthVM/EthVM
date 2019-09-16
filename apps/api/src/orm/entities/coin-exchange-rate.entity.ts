import { Column, PrimaryColumn, Entity } from 'typeorm'
import { assignClean } from '@app/shared/utils'
import {BigNumberTransformer} from '@app/orm/transformers/big-number.transformer';
import BigNumber from 'bignumber.js';

@Entity('coin_exchange_rate')
export class CoinExchangeRateEntity {

  constructor(data: any) {
    assignClean(this, data);
  }

  @PrimaryColumn({ type: 'varchar', length: 24, readonly: true })
  id!: string

  @Column({ type: 'char', length: 3, readonly: true })
  currency!: string

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  price!: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  marketCap!: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  vol24h!: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  change24h!: BigNumber

  @Column({ type: 'bigint', readonly: true })
  lastUpdated!: string

}
