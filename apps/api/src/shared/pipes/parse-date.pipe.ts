import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { EthService } from '@app/shared/eth.service'

@Injectable()
export class ParseDatePipe implements PipeTransform<number, Date | null> {
  constructor() {}

  transform(value: number, metadata: ArgumentMetadata): Date | null {
    return value ? new Date(value) : null
  }
}
