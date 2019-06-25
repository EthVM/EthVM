import {AccountEntity} from '@app/orm/entities/account.entity'
import {BlockHeaderEntity} from '@app/orm/entities/block-header.entity'
import {ContractMetadataEntity} from '@app/orm/entities/contract-metadata.entity'
import {ContractEntity} from '@app/orm/entities/contract.entity'
import {Erc20BalanceEntity} from '@app/orm/entities/erc20-balance.entity'
import {Erc721BalanceEntity} from '@app/orm/entities/erc721-balance.entity'
import {FungibleBalanceTransferEntity} from '@app/orm/entities/fungible-balance-transfer.entity'
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
import { CONNECTION } from '@app/orm/config'

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
      FungibleBalanceTransferEntity,
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
    ], CONNECTION.PRINCIPAL),
    TypeOrmModule.forFeature([
      AccountEntity,
      BlockHeaderEntity,
      UncleEntity,
      ContractEntity,
      ContractMetadataEntity,
      Erc20BalanceEntity,
      Erc721BalanceEntity,
      FungibleBalanceTransferEntity,
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
    ], CONNECTION.METRICS),
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
  ],
})
export class DaoModule {

}
