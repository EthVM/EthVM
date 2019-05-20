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
        entities: ['src/**/**.entity{.ts,.js}'],
        logging: ['error'],
        maxQueryExecutionTime: 500,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class OrmModule {}
