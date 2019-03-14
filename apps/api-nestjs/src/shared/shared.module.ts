import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@app/shared/config.service'
import { DurationService } from '@app/shared/duration.service'

@Global()
@Module({
  providers: [ConfigService, DurationService],
  exports: [ConfigService, DurationService]
})
export class SharedModule {}
