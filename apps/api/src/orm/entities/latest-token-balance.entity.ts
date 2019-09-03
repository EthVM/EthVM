import {Entity} from 'typeorm'
import {TokenExchangeRateEntity} from '@app/orm/entities/token-exchange-rate.entity';
import {ContractMetadataEntity} from '@app/orm/entities/contract-metadata.entity';
import {EthListContractMetadataEntity} from '@app/orm/entities/eth-list-contract-metadata.entity';
import {AbstractBalanceEntity} from '@app/orm/abstract-entities/abstract-balance.entity';

@Entity('latest_token_balance')
export class LatestTokenBalanceEntity  extends AbstractBalanceEntity {

  // Relations which are never loaded as relations directly
  tokenExchangeRate?: TokenExchangeRateEntity
  contractMetadata?: ContractMetadataEntity
  ethListContractMetadata?: EthListContractMetadataEntity

}
