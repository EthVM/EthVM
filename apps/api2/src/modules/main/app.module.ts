import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppService } from './app.service'
import { ConfigModule } from './../config'
import { GraphQLModule } from '../graphql/graphql.module'
import { BlockModule } from '../blocks/block.module'

@Module({
  imports: [TypeOrmModule.forRoot(), GraphQLModule, ConfigModule, BlockModule],
  providers: [AppService]
})
export class AppModule {}
