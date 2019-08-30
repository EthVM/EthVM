import {Entity} from 'typeorm'
import {TxCountEntity} from '@app/orm/entities/tx-count.entity'

@Entity('address_internal_transaction_count')
export class AddressInternalTransactionCountEntity extends TxCountEntity { }
