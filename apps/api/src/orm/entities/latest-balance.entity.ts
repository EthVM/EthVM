import {Entity} from 'typeorm'
import {AbstractBalanceEntity} from '@app/orm/abstract-entities/abstract-balance.entity';

@Entity('latest_balance')
export class LatestBalanceEntity extends AbstractBalanceEntity {}
