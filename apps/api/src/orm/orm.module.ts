import { Inject, Module } from '@nestjs/common'
import { InjectConnection, TypeOrmModule } from '@nestjs/typeorm'
import { ConfigService } from '@app/shared/config.service'
import { Connection, ConnectionOptions } from 'typeorm'
import { SnakeCaseNamingStrategy } from '@app/orm/config'
import { Logger } from 'winston'
import { PostgresDriver } from 'typeorm/driver/postgres/PostgresDriver'

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
        maxQueryExecutionTime: 1000,
        cache: {
          type: 'redis',
          options: {...configService.redis, string_numbers: true}, // Set Redis string_numbers to true to handle numbers as Strings
          // global cache strategy of 60 seconds
          duration: 10000,
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class OrmModule {

  constructor(
    @InjectConnection()
    private readonly connection: Connection,
    @Inject('winston')
    private readonly logger: Logger,
    private readonly configService: ConfigService,
  ) {

    // we set statement timeout on all connections (default max 30 seconds)

    const driver = connection.driver as PostgresDriver
    const {master: masterPool, slaves: replicaPool} = driver
    const pools = [masterPool, ...replicaPool]
    this.setStatementTimeouts(pools, configService.db.statementTimeout)

  }

  private setStatementTimeouts(pools, timeout: string): void {
    pools.forEach(pool => pool.on('connect', client => {
      this.logger.debug(`[ORM] Setting statement timeout to ${timeout} on new db connection`)
      client.query(`SET statement_timeout to \'${timeout}\'`)
    }))
  }

}
