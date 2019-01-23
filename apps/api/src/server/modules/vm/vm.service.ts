import { Token } from '@app/server/modules/tokens'
import { VmEngine } from '@app/server/modules/vm'

export interface VmService {
  getTokensBalance(address: string): Promise<Token[]>
}

export class VmServiceImpl implements VmService {
  constructor(private readonly vme: VmEngine) {}

  public getTokensBalance(address: string): Promise<Token[]> {
    return this.vme.getTokensBalance(address)
  }
}
