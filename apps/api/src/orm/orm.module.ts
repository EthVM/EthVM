import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigService } from '@app/shared/config.service'
import { ConnectionOptions } from 'typeorm'
import { DbConnection, SnakeCaseNamingStrategy } from '@app/orm/config'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: DbConnection.Principal,
      useFactory: async (configService: ConfigService): Promise<ConnectionOptions> => ({
        type: 'postgres',
        url: configService.dbPrincipal.url,
        synchronize: false,
        namingStrategy: new SnakeCaseNamingStrategy(),
        entities: ['src/**/**.entity{.ts,.js}'],
        logging: ['error'],
        maxQueryExecutionTime: 1000,
        cache: {
          type: 'redis',
          options: { ...configService.redis, string_numbers: true}, // Set Redis string_numbers to true to handle numbers as Strings
          // global cache strategy of 60 seconds
          duration: 60000,
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      name: DbConnection.Metrics,
      useFactory: async (configService: ConfigService): Promise<ConnectionOptions> => ({
        type: 'postgres',
        url: configService.dbMetrics.url,
        synchronize: false,
        namingStrategy: new SnakeCaseNamingStrategy(),
        entities: ['src/**/**.entity{.ts,.js}'],
        logging: ['error'],
        maxQueryExecutionTime: 1000,
        cache: {
          type: 'redis',
          options: { ...configService.redis, string_numbers: true}, // Set Redis string_numbers to true to handle numbers as Strings
          // global cache strategy of 60 seconds
          duration: 60000,
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class OrmModule {
}
