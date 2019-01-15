export class AccountInfo {
  private address: string
  private balance?: number
  private balanceUSD?: number
  private ethusd?: number
  private totalTxs?: number
  private miner?: boolean
  private creator?: boolean
  private typeAddrs?: string

  constructor(_address: string, _type: string) {
    this.address = _address
    this.typeAddrs = _type
    this.balance = 0
    this.balanceUSD = 0
    this.ethusd = 0
    this.totalTxs = 0
    this.miner = false
    this.creator = false
  }
  /*Getters: */
  public getAddress(): string {
    return this.address
  }
  public getType(): string {
    return this.typeAddrs
  }
  public getBalance(): number {
    return this.balance
  }

  public getUSD(): number {
    return this.balanceUSD
  }

  public getEthPrice(): number {
    return this.ethusd
  }

  public getTotalTxs(): number {
    return this.totalTxs
  }

  public isMiner(): boolean {
    return this.miner
  }
  public isCreator(): boolean {
    return this.creator
  }

  /* Setters: */
  public setBalance(_balance: number) {
    this.balance = _balance
  }

  public setUSD(_usd: number) {
    this.balanceUSD = _usd
  }
  public setMiner(_value: boolean) {
    this.miner = _value
  }

  public setEthPrice(ethPrice: number) {
    this.ethusd = ethPrice
  }

  public setTotalTxs(_total: number) {
    this.totalTxs = _total
  }

  public setCreator(_value: boolean) {
    this.creator = _value
  }
}
