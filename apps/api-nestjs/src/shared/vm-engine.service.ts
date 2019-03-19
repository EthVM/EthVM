import { Injectable } from '@nestjs/common'
import { ConfigService } from '@app/shared/config.service'

export interface VmEngineOptions {
  rpcUrl: string
  tokensAddress: VmContract
}

export interface VmContract {
  address: string
}

@Injectable()
export class VmEngineService {

  opts: VmEngineOptions

  constructor(private readonly configService: ConfigService) {
    this.opts = {
      rpcUrl: configService.vmEngine.rpcUrl,
      tokensAddress: {
        address: configService.vmEngine.tokensSmartContract
      }
    }
  }

}
