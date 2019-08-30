import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('canonical_ether_balance')
export class EtherBalanceView {
  @PrimaryColumn()
  public address: string

  @Column()
  public balance: string

  @Column()
  public blockNumber: string
}
