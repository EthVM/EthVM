import {AccountEntity} from '@app/orm/entities/account.entity'
import {BlockHeaderEntity} from '@app/orm/entities/block-header.entity'
import {ContractMetadataEntity} from '@app/orm/entities/contract-metadata.entity'
import {ContractEntity} from '@app/orm/entities/contract.entity'
import {Erc20BalanceEntity} from '@app/orm/entities/erc20-balance.entity'
import {Erc721BalanceEntity} from '@app/orm/entities/erc721-balance.entity'
import {FungibleBalanceDeltaEntity} from '@app/orm/entities/fungible-balance-delta.entity'
import {TokenExchangeRateEntity} from '@app/orm/entities/token-exchange-rate.entity'
import {TransactionReceiptEntity} from '@app/orm/entities/transaction-receipt.entity'
import {TransactionTraceEntity} from '@app/orm/entities/transaction-trace.entity'
import {TransactionEntity} from '@app/orm/entities/transaction.entity'
import {UncleEntity} from '@app/orm/entities/uncle.entity'
import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {CoinExchangeRateEntity} from '@app/orm/entities/coin-exchange-rate.entity'
import {Erc721MetadataEntity} from '@app/orm/entities/erc721-metadata.entity'
import {Erc20MetadataEntity} from '@app/orm/entities/erc20-metadata.entity'
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
import {BlockMetricEntity} from '@app/orm/entities/block-metric.entity'
import { MetadataEntity } from '@app/orm/entities/metadata.entity'
import { MetadataService } from '@app/dao/metadata.service'
import { TokenMetadataEntity } from '@app/orm/entities/token-metadata.entity'
import { DbConnection } from '@app/orm/config'
import { InternalTransferEntity } from '@app/orm/entities/internal-transfer.entity'
import { TokenDetailEntity } from '@app/orm/entities/token-detail.entity'
import { BalanceEntity } from '@app/orm/entities/balance.entity'
import { BalanceService } from '@app/dao/balance.service'
import { BalanceDeltaEntity } from '@app/orm/entities/balance-delta.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AccountEntity,
      BlockHeaderEntity,
      UncleEntity,
      ContractEntity,
      ContractMetadataEntity,
      Erc20BalanceEntity,
      Erc721BalanceEntity,
      FungibleBalanceDeltaEntity,
      TokenExchangeRateEntity,
      TransactionEntity,
      TransactionReceiptEntity,
      TransactionTraceEntity,
      Erc20MetadataEntity,
      Erc721MetadataEntity,
      CoinExchangeRateEntity,
      BlockMetricEntity,
      MetadataEntity,
      InternalTransferEntity,
      TokenMetadataEntity,
      TokenDetailEntity,
      BalanceEntity,
      BalanceDeltaEntity,
    ], DbConnection.Principal),
    TypeOrmModule.forFeature([
      AccountEntity,
      BlockHeaderEntity,
      UncleEntity,
      ContractEntity,
      ContractMetadataEntity,
      Erc20BalanceEntity,
      Erc721BalanceEntity,
      FungibleBalanceDeltaEntity,
      TokenExchangeRateEntity,
      TransactionEntity,
      TransactionReceiptEntity,
      TransactionTraceEntity,
      Erc20MetadataEntity,
      Erc721MetadataEntity,
      CoinExchangeRateEntity,
      BlockMetricEntity,
      MetadataEntity,
    ], DbConnection.Metrics),
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
