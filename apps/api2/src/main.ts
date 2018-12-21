import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './modules/main/app.module'
import { setupSwagger } from './swagger'
import { ConfigService } from './modules/config/config.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  setupSwagger(app)
  let config = app.get(ConfigService)
  let { host, port } = config
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(port, host)
}
bootstrap()
