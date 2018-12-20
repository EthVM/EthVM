import {Module} from '@nestjs/common';

import {GraphQLModule as ApolloGraphQLModule, GqlModuleOptions} from '@nestjs/graphql';
import * as GraphQLJSON from 'graphql-type-json';
import {DateScalar} from './scalars/date.scalar';
import {join} from 'path';

@Module({
    imports: [
        ApolloGraphQLModule.forRootAsync({
            useFactory: async (): Promise<any> => {
                return {
                    typePaths: ['./src/**/*.graphql'],
                    resolvers: {JSON: GraphQLJSON},
                    cacheControl: true,
                    cors: true,
                    definitions: {
                        path: join(process.cwd(), 'src/modules/graphql/schema.ts'),
                        outputAs: 'class'
                    },
                    context: ({ req, res }) => ({
                        request: req,
                        response: res
                    }),
                }
            },
        }),
    ],
    providers: [DateScalar]
})
export class GraphQLModule {

}
