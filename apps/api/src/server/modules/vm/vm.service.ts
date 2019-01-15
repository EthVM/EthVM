import { Token } from '@app/server/modules/token'
import { VmEngine } from '@app/server/modules/vm'

export interface VmService {
  getAccount(): Promise<any>
  getTokens(address: string): Promise<Token[]>
}

export class VmServiceImpl implements VmService {
  constructor(private readonly vme: VmEngine) {}

  public getAccount(): Promise<any> {
    return this.vme.getAccount()
  }

  public getTokens(address: string): Promise<Token[]> {
    return this.vme.getTokens(address)
  }
}
