import { Column } from 'typeorm'
import { assignClean } from '@app/shared/utils'

export enum ContractType {
  GENERIC, ERC20, ERC721
}

export class TypeEmbedded {

  constructor(data: any) {
    assignClean(this, data)
  }

  @Column({type: 'enum', enum: ContractType, readonly: true})
  string: ContractType

}
