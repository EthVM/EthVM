import {Entity} from 'typeorm'
import {TxCountEntity} from '@app/orm/entities/tx-count.entity';

@Entity('address_transaction_count')
export class AddressTransactionCountEntity extends TxCountEntity { }
