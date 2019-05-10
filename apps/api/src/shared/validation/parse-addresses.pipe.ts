import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { EthService } from '@app/shared/eth.service'

@Injectable()
export class ParseAddressesPipe implements PipeTransform<string[], string[]> {
  constructor(private readonly ethService: EthService) {}

  transform(value: string[], metadata: ArgumentMetadata): string[] {
    value.forEach(val => {
      if (!this.ethService.isValidAddress(val)) {
        throw new BadRequestException('Invalid address hash')
      }
      if (val.substring(0, 2) !== '0x') {
        val = `0x${val}`
      }      
    })
    return value
  }
}
