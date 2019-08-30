import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { EthService } from '@app/shared/eth.service'

@Injectable()
export class ParseLimitPipe implements PipeTransform<number, number> {
  constructor(private readonly ethService: EthService) {}

  transform(value: number, metadata: ArgumentMetadata): number {
    if (!value) return 10

    if (!this.ethService.isValidLimitSize(value)) {
      throw new BadRequestException('Invalid limit. Must be greater than 0 and less than 100.')
    }

    return value
  }
}
