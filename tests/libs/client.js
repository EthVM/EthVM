import { GraphQLClient } from "graphql-request"
import ethvmConfigs from "../ethvm-config"

const client = new GraphQLClient(ethvmConfigs.GRAPHQL_ENDPOINT, {
  headers: {}
});

export default client
