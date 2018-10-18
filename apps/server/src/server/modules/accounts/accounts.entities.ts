export interface Account {
  address: string
  balance: Buffer
  nonce: Buffer
  contract?: number
}
