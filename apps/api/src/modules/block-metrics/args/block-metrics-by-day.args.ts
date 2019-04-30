import { ArgsType, Field, registerEnumType } from 'type-graphql'
import { Duration } from '@app/graphql/schema'

registerEnumType(Duration, {
  name: 'Duration',
});

@ArgsType()
export class BlockMetricsByDayArgs {
  @Field(type => Duration)
  duration!: Duration

  @Field(type => [String])
  fields?: string[]

}
