import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigService } from '@app/shared/config.service'
import { ConnectionOptions } from 'typeorm'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService): Promise<ConnectionOptions> => ({
        type: 'postgres',
        url: configService.db.url,
        synchronize: false,
        // TODO reset to all src/**/**.entity
        entities: ['src/orm/entities/**.entity{.ts,.js}'],
        logger: 'debug',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class OrmModule {}
