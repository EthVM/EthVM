import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('canonical_erc20_balance')
export class Erc20BalanceView {
  @PrimaryColumn()
  public address: string

  @Column()
  public contract: string

  @Column()
  public amount: string
}
