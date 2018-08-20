import config from '@app/config'
import * as P from 'pino'

export const logger = P({
  enabled: config.get('general.logs.enabled') === 'true',
  name: config.get('general.logs.app_id'),
  level: config.get('general.logs.level')
})
