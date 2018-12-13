import config from '@app/config'
import * as P from 'pino'

export const logger = P({
  enabled: Boolean(config.get('general.logs.enabled')),
  name: config.get('general.logs.app_id'),
  level: config.get('general.logs.level'),
  prettyPrint: config.get('general.logs.pretty')
})
