import { Module } from '@nestjs/common'
import { BlockModule } from '@app/modules/blocks/block.module'
import { SharedModule } from '@app/shared/shared.module'
import { OrmModule } from '@app/orm/orm.module'
import { GraphQLModule } from '@app/graphql/graphql.module'

@Module({
  imports: [
    SharedModule,
    GraphQLModule,
    OrmModule,
    BlockModule
  ]
})
export class AppModule {}
