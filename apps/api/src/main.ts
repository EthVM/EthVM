import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from '@app/app.module'
import { ConfigService } from '@app/shared/config.service'
import { Logger } from 'winston'
import * as rateLimit from 'express-rate-limit'
import RateLimit = require('express-rate-limit')
import helmet = require('helmet')

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useLogger(app.get<Logger>('winston'))

  app.enableCors()
  app.useGlobalPipes(new ValidationPipe())



  const config = app.get(ConfigService)

  // add rate limiting
  const {windowMs} = config.expressRateLimit
  const {max} = config.expressRateLimit
  app.use(rateLimit({ windowMs, max }))

  // add helmet
  app.use(helmet())

  const { host, port } = config

  await app.listen(port, host)
}

bootstrap()
