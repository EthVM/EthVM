import { Module, NestModule, MiddlewareConsumer, Inject } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppService } from './app.service'
import { GraphQLModule } from '../graphql/graphql.module'
import { BlockModule } from '../blocks/block.module'
import { ConfigModule } from '../config/config.module'

// import { ConfigService } from '../config/config.service'
@Module({
  imports: [TypeOrmModule.forRoot(), GraphQLModule, BlockModule, ConfigModule],
  providers: [AppService]
})
export class AppModule {}
