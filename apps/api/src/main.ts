import { AppModule } from '@app/app.module'
import { ConfigService } from '@app/shared/config.service'
import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import ExpressRateLimit from 'express-rate-limit'
import helmet from 'helmet'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors()
  app.useGlobalPipes(new ValidationPipe())

  const config = app.get(ConfigService)

  // add rate limiting
  const { windowMs } = config.expressRateLimit
  const { max } = config.expressRateLimit
  app.use(ExpressRateLimit({ windowMs, max }))

  // add helmet
  app.use(helmet())

  const { host, port } = config

  await app.listen(port, host)

}

bootstrap()
