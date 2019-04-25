import {AccountEntity} from '@app/orm/entities/account.entity'
import {BlockHeaderEntity} from '@app/orm/entities/block-header.entity'
import {BlockMetricsDailyEntity} from '@app/orm/entities/block-metrics-daily.entity'
import {ContractMetadataEntity} from '@app/orm/entities/contract-metadata.entity'
import {ContractEntity} from '@app/orm/entities/contract.entity'
import {Erc20BalanceEntity} from '@app/orm/entities/erc20-balance.entity'
import {Erc721BalanceEntity} from '@app/orm/entities/erc721-balance.entity'
import {FungibleBalanceTransferEntity} from '@app/orm/entities/fungible-balance-transfer.entity'
import {TokenExchangeRateEntity} from '@app/orm/entities/token-exchange-rate.entity'
import {TransactionReceiptEntity} from '@app/orm/entities/transaction-receipt.entity'
import {TransactionTraceEntity} from '@app/orm/entities/transaction-trace.entity'
import {TransactionEntity} from '@app/orm/entities/transaction.entity'
import {UncleEntity} from '@app/orm/entities/uncle.entity'
import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {AccountService} from './account.service'
import {BlockMetricsService} from './block-metrics.service'
import {BlockService} from './block.service'
import {ContractService} from './contract.service'
import {SearchService} from './search.service'
import {TokenService} from './token.service'
import {TransferService} from './transfer.service'
import {TxService} from './tx.service'
import {UncleService} from './uncle.service'
import {CoinExchangeRateEntity} from '@app/orm/entities/coin-exchange-rate.entity'
import {Erc721MetadataEntity} from '@app/orm/entities/erc721-metadata.entity'
import {Erc20MetadataEntity} from '@app/orm/entities/erc20-metadata.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AccountEntity,
      BlockHeaderEntity,
      BlockMetricsDailyEntity,
      UncleEntity,
      ContractEntity,
      ContractMetadataEntity,
      Erc20BalanceEntity,
      Erc721BalanceEntity,
      FungibleBalanceTransferEntity,
      TokenExchangeRateEntity,
      TransactionEntity,
      TransactionReceiptEntity,
      TransactionTraceEntity,
      Erc20MetadataEntity,
      Erc721MetadataEntity,
      CoinExchangeRateEntity,
    ]),
  ],
  providers: [
    AccountService,
    BlockService,
    BlockMetricsService,
    ContractService,
    SearchService,
    TokenService,
    TransferService,
    TxService,
    UncleService,
  ],
  exports: [
    AccountService,
    BlockService,
    BlockMetricsService,
    ContractService,
    SearchService,
    TokenService,
    TransferService,
    TxService,
    UncleService,
  ],
})
export class DaoModule {


}
