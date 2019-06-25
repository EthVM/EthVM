import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigService } from '@app/shared/config.service'
import { ConnectionOptions } from 'typeorm'
import { CONNECTION, SnakeCaseNamingStrategy } from '@app/orm/config'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: CONNECTION.PRINCIPAL,
      useFactory: async (configService: ConfigService): Promise<ConnectionOptions> => ({
        type: 'postgres',
        url: configService.dbPrincipal.url,
        synchronize: false,
        namingStrategy: new SnakeCaseNamingStrategy(),
        entities: ['src/**/**.entity{.ts,.js}'],
        logging: ['error'],
        maxQueryExecutionTime: 1000,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      name: CONNECTION.METRICS,
      useFactory: async (configService: ConfigService): Promise<ConnectionOptions> => ({
        type: 'postgres',
        url: configService.dbMetrics.url,
        synchronize: false,
        namingStrategy: new SnakeCaseNamingStrategy(),
        entities: ['src/**/**.entity{.ts,.js}'],
        logging: 'all',
        maxQueryExecutionTime: 1000,
        cache: {
          type: 'redis',
          options: configService.redis,
          // global cache strategy of 15 seconds
          duration: 60000,
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class OrmModule {
}
