import { Config } from '@app/config'
import { Connection, createConnection } from 'typeorm'

export async function ConnectionFactory(config: Config): Promise<Connection> {
  return createConnection(config.postgres)
}
