import { Module } from '@nestjs/common'
import { GraphQLModule as ApolloGraphQLModule } from '@nestjs/graphql'
import * as GraphQLJSON from 'graphql-type-json'
import { DateScalar } from './scalars/date.scalar'
import { BufferScalar } from './scalars/buffer.scalar'
import { DecimalScalar } from './scalars/decimal.scalar'
import { join } from 'path'

@Module({
  imports: [
    ApolloGraphQLModule.forRootAsync({
      useFactory: async (): Promise<any> => {
        return {
          typePaths: ['./src/**/*.graphql'],
          resolvers: { JSON: GraphQLJSON, Decimal: DecimalScalar, Buffer: BufferScalar },
          cacheControl: true,
          installSubscriptionHandlers: true,
          cors: true,
          definitions: {
            path: join(process.cwd(), 'src/modules/graphql/schema.ts'),
            outputAs: 'class'
          },
          context: ({ req, res }) => ({
            request: req,
            response: res
          })
        }
      }
    })
  ],
  providers: [DateScalar]
})
export class GraphQLModule {}
