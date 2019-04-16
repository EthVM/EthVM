import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity('ether_balance')
export class EtherBalanceView {
  @PrimaryColumn()
  public address: string

  @Column()
  public amount: string
}
