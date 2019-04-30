import { ArgsType, Field } from 'type-graphql'

@ArgsType()
export class TokensMetadataArgs {
  @Field(type => [String])
  symbols!: string[]
  
}
