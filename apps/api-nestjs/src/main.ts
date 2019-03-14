import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from '@app/app.module'
import { ConfigService } from '@app/shared/config.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config = app.get(ConfigService)
  const { host, port } = config

  app.enableCors()
  app.useGlobalPipes(new ValidationPipe())

  await app.listen(port, host)
}
bootstrap()
