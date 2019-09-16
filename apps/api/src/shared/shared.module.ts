import { ConfigService } from '@app/shared/config.service'
import { DurationService } from '@app/shared/duration.service'
import { EthService } from '@app/shared/eth.service'
import { ParseAddressPipe } from '@app/shared/pipes/parse-address.pipe'
import { ParseBigNumberPipe } from '@app/shared/pipes/parse-big-number.pipe'
import { ParseHashPipe } from '@app/shared/pipes/parse-hash.pipe'
import { ParsePagePipe } from '@app/shared/pipes/parse-page.pipe'
import { Global, Module } from '@nestjs/common'
import { DaoModule } from '@app/dao/dao.module'
import { SyncingInterceptor } from '@app/shared/interceptors/syncing-interceptor'
import {ParseLimitPipe} from '@app/shared/pipes/parse-limit.pipe'
import {ParseDatePipe} from '@app/shared/pipes/parse-date.pipe'

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
