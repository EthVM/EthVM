import {Inject, Injectable} from '@nestjs/common';
import {PubSub} from 'graphql-subscriptions';
import {Logger} from 'winston';

@Injectable()
export class PgSubscriptionService {

  constructor(
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
    @Inject('winston') private readonly logger: Logger,
    private readonly config: Config
  ) {



  }

}
