import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { EthService } from '@app/shared/eth.service'

@Injectable()
export class ParseAddressPipe implements PipeTransform<String, String> {

  constructor(private readonly ethService: EthService){}

  transform(value: string, metadata: ArgumentMetadata): String {

    if (!this.ethService.isValidAddress(value)) {
      throw new BadRequestException('Invalid address hash');
    }
    return value.replace('0x', '');
  }

}
