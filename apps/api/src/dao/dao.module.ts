import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {AccountService} from '@app/dao/account.service'
import {BlockService} from '@app/dao/block.service'
import {BlockMetricsService} from '@app/dao/block-metrics.service'
import {ContractService} from '@app/dao/contract.service'
import {TransferService} from '@app/dao/transfer.service'
import {TokenService} from '@app/dao/token.service'
import {SearchService} from '@app/dao/search.service'
import {ReceiptService} from '@app/dao/receipt.service'
import {TraceService} from '@app/dao/trace.service'
import {UncleService} from '@app/dao/uncle.service'
import {TxService} from '@app/dao/tx.service'
import {MetadataService} from '@app/dao/metadata.service'
import {BalanceService} from '@app/dao/balance.service'
import {ContractEntity} from '@app/orm/entities/contract.entity';
import {BalanceDeltaEntity} from '@app/orm/entities/balance-delta.entity';
import {BalanceEntity} from '@app/orm/entities/balance.entity';
import {BlockHeaderEntity} from '@app/orm/entities/block-header.entity';
import {TransactionEntity} from '@app/orm/entities/transaction.entity';
import {SyncStatusEntity} from '@app/orm/entities/sync-status.entity';
import {MinerBlockCountEntity} from '@app/orm/entities/miner-block-count.entity';
import {UncleEntity} from '@app/orm/entities/uncle.entity';
import {TraceEntity} from '@app/orm/entities/trace.entity';
import {CoinExchangeRateEntity} from '@app/orm/entities/coin-exchange-rate.entity';
import {TokenExchangeRateEntity} from '@app/orm/entities/token-exchange-rate.entity';
import {TokenMetadataEntity} from '@app/orm/entities/token-metadata.entity';
import {TokenDetailEntity} from '@app/orm/entities/token-detail.entity';
import {AddressTransactionCountEntity} from '@app/orm/entities/address-transaction-count.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ContractEntity,
      BalanceDeltaEntity,
      BalanceEntity,
      BlockHeaderEntity,
      MinerBlockCountEntity,
      SyncStatusEntity,
      TransactionEntity,
      UncleEntity,
      TraceEntity,
      CoinExchangeRateEntity,
      TokenExchangeRateEntity,
      TokenMetadataEntity,
      TokenDetailEntity,
      AddressTransactionCountEntity,
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
    TraceService,
    ReceiptService,
    MetadataService,
    BalanceService,
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
    TraceService,
    ReceiptService,
    MetadataService,
    BalanceService,
  ],
})
export class DaoModule {

}
