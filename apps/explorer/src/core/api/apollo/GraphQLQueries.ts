import gql from 'graphql-tag'

export class GraphQLQueries {
  public static Block(hash: string) {
    return {
      query: gql`{ query block ($hash: String!) {
        id
        header {
          number
          hash
          parentHash
          nonce
          sha3Uncles
          logsBloom
          # transactionsRoot
          stateRoot
          receiptsRoot
          author
          difficulty
          extraData
          gasLimit
          gasUsed
          timestamp
          size
        }
        totalDifficulty
      }
    }`,
      variables: {
        hash
      }
    }
  }
}
