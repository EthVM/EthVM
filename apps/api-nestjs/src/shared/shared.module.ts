import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@app/shared/config.service'
import { DurationService } from '@app/shared/duration.service'
import { EthService } from '@app/shared/eth.service'
import { ParseHashPipe } from '@app/shared/validation/parse-hash.pipe'

@Global()
@Module({
  providers: [ConfigService, DurationService, EthService, ParseHashPipe],
  exports: [ConfigService, DurationService, EthService, ParseHashPipe]
})
export class SharedModule {}
