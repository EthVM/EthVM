import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@app/shared/config.service'
import { DurationService } from '@app/shared/duration.service'
import { EthService } from '@app/shared/eth.service'

@Global()
@Module({
  providers: [ConfigService, DurationService, EthService],
  exports: [ConfigService, DurationService, EthService]
})
export class SharedModule {}
