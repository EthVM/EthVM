import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { EthService } from '@app/shared/eth.service'

@Injectable()
export class ParseAddressPipe implements PipeTransform<string, string> {
  constructor(private readonly ethService: EthService) {}

  transform(value: string, metadata: ArgumentMetadata): string {
    if (!this.ethService.isValidAddress(value)) {
      throw new BadRequestException('Invalid address hash')
    }
    if (value.substring(0, 2) !== '0x') {
      value = `0x${value}`
    }
    return value
  }
}
