import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { EthService } from '@app/shared/eth.service'

@Injectable()
export class ParseHashPipe implements PipeTransform<string, string> {
  constructor(private readonly ethService: EthService) {}

  transform(value: string, metadata: ArgumentMetadata): string {
    if (!this.ethService.isValidHash(value)) {
      throw new BadRequestException('Invalid hash')
    }
    return value.replace('0x', '')
  }
}
