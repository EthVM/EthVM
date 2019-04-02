import { AppModule } from '@app/app.module'
import { ConfigService } from '@app/shared/config.service'
import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { Logger } from 'winston'

declare const module: any

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false })

  app.useLogger(app.get<Logger>('winston'))

  app.enableCors()
  app.useGlobalPipes(new ValidationPipe())

  const config = app.get(ConfigService)
  const { host, port } = config

  await app.listen(port, host)

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }
}

bootstrap()
