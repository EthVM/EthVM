import { Token } from '@app/server/modules/tokens'
import { VmEngine } from '@app/server/modules/vm'

export interface VmService {
  getTokens(address: string): Promise<Token[]>
}

export class VmServiceImpl implements VmService {
  constructor(private readonly vme: VmEngine) {}

  public getTokens(address: string): Promise<Token[]> {
    return this.vme.getTokens(address)
  }
}
