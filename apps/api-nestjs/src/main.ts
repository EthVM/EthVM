import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from '@app/app.module'
import { ConfigService } from '@app/shared/config.service'
import { Logger } from 'winston'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false })

  app.useLogger(app.get<Logger>('winston'))

  app.enableCors()
  app.useGlobalPipes(new ValidationPipe())

  const config = app.get(ConfigService)
  const { host, port } = config

  await app.listen(port, host)
}

bootstrap()
