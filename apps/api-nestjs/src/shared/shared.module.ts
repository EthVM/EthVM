import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@app/shared/config.service'

@Global()
@Module({
    providers: [ConfigService],
    exports: [ConfigService]
})
export class SharedModule {
}
