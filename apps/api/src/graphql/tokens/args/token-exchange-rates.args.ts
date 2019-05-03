import { ArgsType, Field } from 'type-graphql'

@ArgsType()
export class TokenExchangeRatesArgs {
  @Field(type => [String])
  symbols = []
}
