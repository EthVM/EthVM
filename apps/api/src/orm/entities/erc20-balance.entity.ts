import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'
import { TokenExchangeRateEntity } from '@app/orm/entities/token-exchange-rate.entity'
import { Erc20MetadataEntity } from '@app/orm/entities/erc20-metadata.entity'
import BigNumber from 'bignumber.js';
import { BigNumberTransformer } from '../transformers/big-number.transformer';

@Entity('canonical_erc20_balance')
export class Erc20BalanceEntity {

  constructor(data: any) {
    assignClean(this, data);
  }

  @PrimaryColumn({type: 'character', length: 42, readonly: true})
  contract!: string

  @PrimaryColumn({type: 'character', length: 42, readonly: true})
  address!: string

  @Column({type: 'numeric', readonly: true, transformer: new BigNumberTransformer()})
  amount!: BigNumber

  @ManyToOne(type => TokenExchangeRateEntity, ter => ter.erc20Balances)
  @JoinColumn({
    name: 'contract',
    referencedColumnName: 'address',
  })
  tokenExchangeRate?: TokenExchangeRateEntity

  @ManyToOne(type => Erc20MetadataEntity, metadata => metadata.balances)
  @JoinColumn({
    name: 'contract',
    referencedColumnName: 'address',
  })
  metadata?: Erc20MetadataEntity

}
