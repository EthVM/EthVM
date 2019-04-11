import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigService } from '@app/shared/config.service'
import { ConnectionOptions } from 'typeorm'
import { SnakeCaseNamingStrategy } from '@app/orm/config'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService): Promise<ConnectionOptions> => ({
        type: 'postgres',
        url: configService.db.url,
        synchronize: false,
        namingStrategy: new SnakeCaseNamingStrategy(),
        // TODO reset to all src/**/**.entity
        entities: ['src/orm/entities/**.entity{.ts,.js}'],
        logging: ['error']
      }),
      inject: [ConfigService],
    }),
  ],
})
export class OrmModule {}
