import { AppModule } from '@app/app.module'
import { ConfigService } from '@app/shared/config.service'
import { NestFactory } from '@nestjs/core'
import ExpressRateLimit from 'express-rate-limit'
import helmet from 'helmet'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors()

  const config = app.get(ConfigService)

  // add rate limiting if not disabled
  const { windowMs, max, disable } = config.expressRateLimit
  if (!disable) {
    app.use(ExpressRateLimit({ windowMs, max }))
  }

  // add helmet
  app.use(helmet())

  const { host, port } = config

  await app.listen(port, host)
}

bootstrap()
