import { BufferScalar } from '@app/graphql/scalars/buffer.scalar';
import { DateScalar } from '@app/graphql/scalars/date.scalar';
import { DecimalScalar } from '@app/graphql/scalars/decimal.scalar';
import { LongScalar } from '@app/graphql/scalars/long.scalar';
import { ConfigService } from '@app/shared/config.service';
import { Module } from '@nestjs/common';
import { GraphQLModule as ApolloGraphQLModule } from '@nestjs/graphql';
import * as GraphQLJSON from 'graphql-type-json';
import { join } from 'path';
import { BigNumberScalar } from './scalars/big-number.scalar';

@Module({
  imports: [
    ApolloGraphQLModule.forRootAsync({
      useFactory: async (configService: ConfigService): Promise<any> => {
        const config = configService.graphql

        return {
          typePaths: ['./src/**/*.graphql'],
          resolvers: { JSON: GraphQLJSON },
          cacheControl: true,
          installSubscriptionHandlers: true,
          cors: true,
          definitions: {
            path: join(process.cwd(), 'src/graphql/schema.ts'),
            outputAs: 'interface',
          },
          context: ({ req, res }) => ({
            request: req,
            response: res,
          }),
          ...config,
        }
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    DateScalar,
    DecimalScalar,
    BufferScalar,
    BigNumberScalar,
    LongScalar,
  ],
})
export class GraphQLModule { }
