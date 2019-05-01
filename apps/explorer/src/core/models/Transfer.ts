export interface Transfer {
  id: string
  from: string
  to: string
  value: string
  timestamp: number
  contract: string
  deltaType: string
  transactionHash: string
}
