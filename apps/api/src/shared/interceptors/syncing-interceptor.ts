import { CallHandler, CanActivate, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { MetadataService } from '@app/dao/metadata.service'
import { Observable } from 'rxjs'
import { SyncingException } from '@app/shared/errors/syncing-exception'

@Injectable()
export class SyncingInterceptor implements NestInterceptor {

  constructor(
    private readonly metadataService: MetadataService
  ) {
  }

  async intercept(context: ExecutionContext, next: CallHandler) {

    let isSyncing = await this.metadataService.isSyncing()
    if (isSyncing === undefined) {
      isSyncing = true
    }

    if (isSyncing) throw new SyncingException('Currently syncing')

    return next.handle()
  }

}
