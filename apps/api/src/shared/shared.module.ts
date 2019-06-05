import { ConfigService } from '@app/shared/config.service'
import { DurationService } from '@app/shared/duration.service'
import { EthService } from '@app/shared/eth.service'
import { ParseAddressPipe } from '@app/shared/validation/parse-address.pipe'
import { ParseBigNumberPipe } from '@app/shared/validation/parse-big-number.pipe'
import { ParseHashPipe } from '@app/shared/validation/parse-hash.pipe'
import { ParsePagePipe } from '@app/shared/validation/parse-page.pipe'
import { Global, Module } from '@nestjs/common'
import { ParseLimitPipe } from './validation/parse-limit.pipe.1'
import { ParseDatePipe } from '@app/shared/validation/parse-date.pipe.1'
import { DaoModule } from '@app/dao/dao.module'
import { SyncingInterceptor } from '@app/shared/interceptors/syncing-interceptor'

@Global()
@Module({
  providers: [ConfigService, DurationService, EthService, ParseHashPipe, ParseAddressPipe, ParseLimitPipe, ParsePagePipe,
    ParseBigNumberPipe, ParseDatePipe, SyncingInterceptor],
  exports: [ConfigService, DurationService, EthService, ParseHashPipe, ParseAddressPipe, ParseLimitPipe, ParsePagePipe,
    ParseBigNumberPipe, ParseDatePipe, SyncingInterceptor],
  imports: [DaoModule],
})
export class SharedModule {
}
