import { Inject, Module } from '@nestjs/common'
import { InjectConnection, TypeOrmModule } from '@nestjs/typeorm'
import { ConfigService } from '@app/shared/config.service'
import { Connection, ConnectionOptions } from 'typeorm'
import { DbConnection, SnakeCaseNamingStrategy } from '@app/orm/config'
import { Logger } from 'winston'
import { PostgresDriver } from 'typeorm/driver/postgres/PostgresDriver'

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
          options: {...configService.redis, string_numbers: true}, // Set Redis string_numbers to true to handle numbers as Strings
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
          options: {...configService.redis, string_numbers: true}, // Set Redis string_numbers to true to handle numbers as Strings
          // global cache strategy of 60 seconds
          duration: 60000,
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class OrmModule {

  constructor(
    @InjectConnection(DbConnection.Principal)
    private readonly principalConnection: Connection,
    @InjectConnection(DbConnection.Metrics)
    private readonly metricsConnection: Connection,
    @Inject('winston')
    private readonly logger: Logger,
    private readonly configService: ConfigService,
  ) {

    // we set statement timeout on all connections (default max 30 seconds)

    const principalDriver = principalConnection.driver as PostgresDriver
    const {master: principalMasterPool, slaves: principalReplicaPools} = principalDriver
    const principalPools = [principalMasterPool, ...principalReplicaPools]
    this.setStatementTimeouts(principalPools, configService.dbPrincipal.statementTimeout)

    const metricsDriver = metricsConnection.driver as PostgresDriver
    const {master: metricsMasterPool, slaves: metricsReplicaPools} = metricsDriver
    const metricsPools = [metricsMasterPool, ...metricsReplicaPools]
    this.setStatementTimeouts(metricsPools, configService.dbMetrics.statementTimeout)

  }

  private setStatementTimeouts(pools, timeout: string): void {
    pools.forEach(pool => pool.on('connect', client => {
      this.logger.debug(`[ORM] Setting statement timeout to ${timeout} on new db connection`)
      client.query(`SET statement_timeout to \'${timeout}\'`)
    }))
  }

}
