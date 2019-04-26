import { Erc721MetadataEntity } from '@app/orm/entities/erc721-metadata.entity';
import { TokenExchangeRateEntity } from '@app/orm/entities/token-exchange-rate.entity';
import { assignClean } from '@app/shared/utils';
import BigNumber from 'bignumber.js';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { BigNumberTransformer } from '../transformers/big-number.transformer';

@Entity('canonical_erc721_balance')
export class Erc721BalanceEntity {

  constructor(data: any) {
    assignClean(this, data);
  }

  @PrimaryColumn({ type: 'character', length: 42, readonly: true })
  contract!: string

  @PrimaryColumn({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  tokenId!: BigNumber

  @PrimaryColumn({ type: 'character', length: 42, readonly: true })
  address!: string

  @Column({ type: 'character', length: 66, readonly: true })
  traceLocationBlockHash?: string

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  traceLocationBlockNumber?: BigNumber

  @Column({ type: 'character', length: 66, readonly: true })
  traceLocationTransactionHash?: string

  @Column({ type: 'integer', readonly: true })
  traceLocationTransactionIndex?: number

  @Column({ type: 'integer', readonly: true })
  traceLocationLogIndex?: number

  @Column({ type: 'character', length: 64, readonly: true })
  traceLocationTraceAddress?: string

  @ManyToOne(type => TokenExchangeRateEntity, ter => ter.erc721Balances)
  @JoinColumn({
    name: 'contract',
    referencedColumnName: 'address',
  })
  tokenExchangeRate?: TokenExchangeRateEntity

  @ManyToOne(type => Erc721MetadataEntity, metadata => metadata.balances)
  @JoinColumn({
    name: 'contract',
    referencedColumnName: 'address',
  })
  metadata?: Erc721MetadataEntity

}
