import { VmService } from '@app/server/modules/vm'

export class  VmServiceImpl implements VmService {
  public setStateRoot(hash: Buffer): Promise<boolean> {
    return Promise.resolve(true)
  }
  public getCurrentStateRoot(): Promise<Buffer> {
    return Promise.resolve(Buffer.from(''))
  }
  public getAccount(): Promise<any> {
    return Promise.resolve(Buffer.from(''))
  }
  public getBalance(address: string): Promise<any> {
    return Promise.resolve(10)
  }
  public getTokensBalance(address: string): Promise<any> {
    return Promise.resolve(Buffer.from(''))
  }
  public call(args: any): Promise<any> {
    return Promise.resolve(Buffer.from(''))
  }
}
