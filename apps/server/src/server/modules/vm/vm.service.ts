import { VmEngine, VmRunner } from '@app/server/modules/vm'

export interface VmService {
  setStateRoot(hash: Buffer): Promise<boolean>
  getCurrentStateRoot(): Promise<Buffer>
  getAccount(): Promise<any>
  getBalance(address: string): Promise<any>
  getTokensBalance(address: string): Promise<any>
  call(args: any): Promise<any>
}

export class VmServiceImpl implements VmService {
  constructor(private readonly vme: VmEngine, private readonly vmr: VmRunner) {}

  public setStateRoot(hash: Buffer): Promise<boolean> {
    this.vmr.setStateRoot(hash)
    return Promise.resolve(true)
  }

  public getCurrentStateRoot(): Promise<Buffer> {
    return this.vmr.getCurrentStateRoot()
  }

  public getAccount(): Promise<any> {
    return this.vme.getAccount()
  }

  public getBalance(address: string): Promise<any> {
    return this.vme.getBalance(address)
  }

  public getTokensBalance(address: string): Promise<any> {
    return this.vme.getTokensBalance(address).then(res => res.filter(token => token.balance > 0))
  }

  public call(args: any): Promise<any> {
    return this.vmr.call(args)
  }
}
