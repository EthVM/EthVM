import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { EthService } from '@app/shared/eth.service'

@Injectable()
export class ParseLimitPipe implements PipeTransform<String, String> {

  constructor(private readonly ethService: EthService){}

  transform(value: string, metadata: ArgumentMetadata): String {

    if (!this.ethService.isValidPageSize(value)) {
      throw new BadRequestException('Invalid limit. Exceeds max page size.')
    }
    return value
  }

}
