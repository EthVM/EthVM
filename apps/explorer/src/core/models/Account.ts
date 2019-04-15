export interface Account {
  address: string
  balance: number
  fromTxCount: number
  toTxCount: number
  totalTxCount: number
  isMiner: boolean
  isContractCreator: boolean
}
