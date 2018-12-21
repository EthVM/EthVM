import { Injectable, Inject } from '@nestjs/common'

@Injectable()
export class AppService {
  constructor() {}

  root(): string {
    return 'http://api.ethvm.lan'
  }
}
