export interface Transfer {
  op: string
  value: Buffer
  from: Buffer
  fromBalance: Buffer
  to: Buffer
  toBalance: Buffer
  input: Buffer
}
